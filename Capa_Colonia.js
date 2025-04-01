// Espera a que todo el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {

    // Verifica que Leaflet y el objeto del mapa estén definidos correctamente
    if (typeof L === "undefined" || typeof map === "undefined") {
        console.error("Leaflet o el mapa no están definidos. Verifica la carga de `mapabase.js`.");
        return;
    }

    // Crea un pane personalizado para las colonias, con z-index para controlar su orden en el mapa
    if (!map.getPane('coloniasPane')) {
        map.createPane('coloniasPane');
        map.getPane('coloniasPane').style.zIndex = 200;
    }

    let capaColonias = null;              // Guardará la capa con los polígonos de colonias
    let vistaInicialAplicada = false;     // Evita que el ajuste de vista se aplique más de una vez
    let coloniaSeleccionada = null;       // Almacena la colonia actualmente seleccionada

    // Cargar archivo GeoJSON con los polígonos de colonias
    fetch("archivos/vectores/colonias_wgs84_geojson_renombrado.geojson")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al cargar el archivo GeoJSON: " + response.statusText);
            }
            return response.json(); // Convierte la respuesta a objeto JSON
        })
        .then(data => {
            console.log("GeoJSON de colonias cargado correctamente:", data);

            // Crea la capa de polígonos en Leaflet usando el GeoJSON cargado
            capaColonias = L.geoJSON(data, {
                pane: 'coloniasPane', // Usa el pane personalizado
                style: {
                    color: "yellow",   // Borde amarillo
                    weight: 2,         // Grosor del borde
                    opacity: 0.7,
                    fillOpacity: 0     // Sin relleno por defecto
                },
                onEachFeature: function (feature, layer) {
                    // Verifica que el feature tenga nombre de colonia
                    if (feature.properties && feature.properties.COLONIA) {

                        // Define el contenido del popup con un botón para ver estadísticas
                        var popupContent = `
                            <div class="popup">
                                <b>Colonia:</b> ${feature.properties.COLONIA}<br>
                                <div class="estadisticasBoton">
                                    <button class="VerEstadisticas btn btn-danger" onclick="verEstadisticas('${feature.properties.COLONIA}')">
                                        Ver Estadísticas
                                    </button>
                                </div>
                            </div>
                        `;

                        // Asocia el popup al polígono
                        layer.bindPopup(popupContent);

                        // Asocia la selección visual al hacer clic en el polígono
                        layer.on("click", function () {
                            seleccionarColonia(layer);
                        });
                    }
                }
            }).addTo(map); // Agrega la capa al mapa

            // Función temporal para mostrar estadísticas al hacer clic en el botón
            function verEstadisticas(colonia) {
                alert(`Mostrando estadísticas de la colonia: ${colonia}`);
            }

            // Ajusta la vista del mapa para mostrar toda la capa (solo una vez)
            if (!vistaInicialAplicada) {
                map.fitBounds(capaColonias.getBounds());
                vistaInicialAplicada = true;
            }
        })
        .catch(error => console.error("Error al cargar el GeoJSON:", error)); // Muestra errores de carga

    // Función que aplica estilo y zoom a una colonia seleccionada
    function seleccionarColonia(layer) {
        // Si ya hay una colonia seleccionada, resetea su estilo
        if (coloniaSeleccionada) {
            coloniaSeleccionada.setStyle({ fillOpacity: 0 });
        }

        // Aplica un relleno suave a la colonia actual para resaltarla
        layer.setStyle({ fillOpacity: 0.15 });
        coloniaSeleccionada = layer;

        // Obtiene los límites del polígono seleccionado
        let bounds = layer.getBounds();

        if (window.innerWidth > 768) {
            // En pantallas grandes, ajusta la vista dejando espacio al panel izquierdo
            map.fitBounds(bounds, { paddingTopLeft: [300, 0], paddingBottomRight: [0, 0] });
        } else {
            // En pantallas pequeñas (móviles), centra y aplica zoom
            map.setView(bounds.getCenter(), 15);
        }

        layer.openPopup(); // Abre el popup asociado a la colonia
    }

    // Función global que permite hacer zoom a una colonia desde otra parte del código (ej: buscador)
    window.zoomAColonia = function (nombreColonia) {
        if (!capaColonias) {
            console.warn("La capa de colonias aún no se ha cargado.");
            return;
        }

        let encontrado = false;

        // Recorre cada capa buscando coincidencias por nombre
        capaColonias.eachLayer(function (layer) {
            if (layer.feature.properties && layer.feature.properties.COLONIA) {
                let nombreEnMapa = layer.feature.properties.COLONIA.trim().toLowerCase();
                let nombreBuscado = nombreColonia.trim().toLowerCase();

                // Si hay coincidencia exacta, selecciona la colonia
                if (nombreEnMapa === nombreBuscado) {
                    seleccionarColonia(layer);
                    encontrado = true;
                }
            }
        });

        // Si no se encontró ninguna coincidencia, muestra advertencia
        if (!encontrado) {
            console.warn(`No se encontró la colonia: ${nombreColonia}`);
        }
    };
});
