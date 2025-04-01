// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
    // Verifica si Leaflet y el mapa están definidos
    if (typeof L === "undefined" || typeof map === "undefined") {
        console.error("Leaflet o el mapa no están definidos. Verifica que `mapabase.js` se cargue primero.");
        return;
    }

    // Crear un "pane" exclusivo para las capas de puntos, con un z-index alto para que esté por encima de otras capas
    if (!map.getPane('capasPuntosPane')) {
        map.createPane('capasPuntosPane');
        map.getPane('capasPuntosPane').style.zIndex = 450;
    }

    // Objeto para almacenar todas las capas de puntos que se carguen
    let capasPuntos = {};

    // Verifica si existe el contenedor del control de capas en el sidebar
    let controlCapasContainer = document.getElementById("controlCapasContainer");
    if (!controlCapasContainer) {
        console.error("No se encontró el contenedor #controlCapasContainer en el HTML.");
        return;
    }

    // Crear una lista HTML para mostrar los controles de visibilidad de las capas
    let listaCapas = document.createElement("ul");
    listaCapas.className = "lista-capas";
    controlCapasContainer.appendChild(listaCapas);

    // Diccionario de íconos personalizados para cada tipo de capa
    const iconosCapas = {
        "Centros de Atencion y Cuidado Infantil": L.icon({ iconUrl: "img/icono/CACI.png", iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] }),
        "Casas de Adulto Mayor": L.icon({ iconUrl: "img/icono/CAM.png", iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] }),
        "Centros de Desarrollo Comunitario": L.icon({ iconUrl: "img/icono/CDC.png", iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] }),
        "Centros Culturales": L.icon({ iconUrl: "img/icono/CC.png", iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] }),
        "Centros Interactivos": L.icon({ iconUrl: "img/icono/CDC_CI.png", iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] }),
        "Centros de Artes y Oficios": L.icon({ iconUrl: "img/icono/CAO.png", iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] })
    };

    // Función para cargar y mostrar una capa GeoJSON de puntos
    function cargarCapaPuntos(nombreCapa, url) {
        fetch(url) // Carga el archivo GeoJSON desde la URL
            .then(response => {
                if (!response.ok) throw new Error(`Error al cargar ${nombreCapa}: ${response.statusText}`);
                return response.json();
            })
            .then(data => {
                console.log(`Capa ${nombreCapa} cargada correctamente`, data);

                // Crear la capa Leaflet a partir del GeoJSON
                capasPuntos[nombreCapa] = L.geoJSON(data, {
                    pane: 'capasPuntosPane',
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, {
                            icon: iconosCapas[nombreCapa] // Usar ícono personalizado
                        });
                    },
                    onEachFeature: function (feature, layer) {
                        // Mostrar un popup diferente según el tipo de capa
                        if (nombreCapa === "Centros de Atencion y Cuidado Infantil") {
                            let name = feature.properties["Name"] || "Sin nombre";
                            let descripcio = feature.properties["descripcio"] || "Sin descripción";
                            let tipoInstalaciones = feature.properties["Tipo de in"] || "Sin información";
                            let edades = feature.properties["Edades"] || "Sin información";
                            let poblacion = feature.properties["Poblacion"] || "Sin información";
                            let direccion = feature.properties["Direccion"] || "Sin información";
                            let responsabl = feature.properties["Responsabl"] || "Sin responsable";
                            let numeroTel = feature.properties["Numero tel"] || "Sin número telefónico";
                            let telefonoD = feature.properties["Telefono d"] || "Sin contacto";

                            layer.bindPopup(
                                `<b>Centro de Atención y Cuidado Infantil</b><br>
                                <b>Nombre:</b> ${name}<br>
                                <b>Descripción:</b> ${descripcio}<br>
                                <b>Tipo de Instalaciones:</b> ${tipoInstalaciones}<br>
                                <b>Edades:</b> ${edades}<br>
                                <b>Población:</b> ${poblacion}<br>
                                <b>Dirección:</b> ${direccion}<br>
                                <b>Responsable:</b> ${responsabl}<br>
                                <b>Número Telefónico:</b> ${numeroTel}<br>
                                <b>Número de contacto:</b> ${telefonoD}`
                            );
                        } else if (nombreCapa === "Casas de Adulto Mayor") {
                            let name = feature.properties.Name || "Sin nombre";
                            let responsable = feature.properties.Responsble || "Sin responsable";
                            let numero = feature.properties["NUMERO"] || "Sin número";
                            layer.bindPopup(
                                `<b>Nombre:</b> ${name}<br>
                                <b>Responsable:</b> ${responsable}<br>
                                <b>Número:</b> ${numero}`
                            );
                        } else if (nombreCapa === "Centros de Desarrollo Comunitario") {
                            let name = feature.properties["Name"] || "Sin nombre";
                            let direc = feature.properties["Direc"] || "Sin dirección";
                            layer.bindPopup(
                                `<b>Centro de Desarrollo Comunitario</b><br>
                                <b>Nombre:</b> ${name}<br>
                                <b>Dirección:</b> ${direc}`
                            );
                        } else if (nombreCapa === "Centros Culturales") {
                            let name = feature.properties["Name"] || "Sin nombre";
                            let direc = feature.properties["Direc"] || "Sin dirección";
                            layer.bindPopup(
                                `<b>Centro Cultural</b><br>
                                <b>Nombre:</b> ${name}<br>
                                <b>Dirección:</b> ${direc}`
                            );
                        } else if (nombreCapa === "Centros Interactivos") {
                            let name = feature.properties["Name"] || "Sin nombre";
                            let direc = feature.properties["Concat"] || "Sin dirección";
                            layer.bindPopup(
                                `<b>Centro Interactivo</b><br>
                                <b>Nombre:</b> ${name}<br>
                                <b>Dirección:</b> ${direc}`
                            );
                        } else if (nombreCapa === "Centros de Artes y Oficios") {
                            let name = feature.properties["Name"] || "Sin nombre";
                            let direc = feature.properties["Concat"] || "Sin dirección";
                            let Responsabl = feature.properties["Responsabl"] || "Sin Responsable";
                            let numero = feature.properties["Numero"] || "Sin Número";
                            layer.bindPopup(
                                `<b>Centro CAO</b><br>
                                <b>Nombre:</b> ${name}<br>
                                <b>Responsable:</b> ${Responsabl}<br>
                                <b>Número:</b> ${numero}<br>
                                <b>Dirección:</b> ${direc}<br>`
                            );
                        } else {
                            // Popup por defecto si no se reconoce el nombre de la capa
                            let nombre = feature.properties.Nombre || "Sin nombre";
                            layer.bindPopup(`<b>${nombreCapa}</b><br>${nombre}`);
                        }
                    }
                });

                // Agregar la capa al mapa
                capasPuntos[nombreCapa].addTo(map);
                capasPuntos[nombreCapa].bringToFront();

                // Crear un nuevo ítem en la lista del sidebar para controlar visibilidad
                let itemCapa = document.createElement("li");

                // Crear checkbox para mostrar/ocultar capa
                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = true;
                checkbox.onchange = function () {
                    if (checkbox.checked) {
                        capasPuntos[nombreCapa].addTo(map);
                        capasPuntos[nombreCapa].bringToFront();
                    } else {
                        map.removeLayer(capasPuntos[nombreCapa]);
                    }
                };

                // Crear imagen del ícono de la capa
                let iconoImg = document.createElement("img");
                let icono = iconosCapas[nombreCapa];
                iconoImg.src = icono ? icono.options.iconUrl : "img/icono/default.png";
                iconoImg.width = 24;
                iconoImg.height = 24;
                iconoImg.style.marginRight = "8px";

                // Crear etiqueta con el nombre de la capa
                let label = document.createElement("span");
                label.textContent = nombreCapa;

                // Agregar checkbox, ícono y etiqueta al ítem de la lista
                itemCapa.appendChild(checkbox);
                itemCapa.appendChild(iconoImg);
                itemCapa.appendChild(label);
                listaCapas.appendChild(itemCapa);
            })
            .catch(error => console.error(`Error al cargar la capa ${nombreCapa}:`, error));
    }

    // Llamar a la función para cargar cada una de las capas
    cargarCapaPuntos("Centros de Atencion y Cuidado Infantil", "archivos/vectores/dataSHP_CACI_mod.geojson");
    cargarCapaPuntos("Casas de Adulto Mayor", "archivos/vectores/dataSHP_CAM_mod.geojson");
    cargarCapaPuntos("Centros de Desarrollo Comunitario", "archivos/vectores/dataSHP_CDC_mod.geojson");
    cargarCapaPuntos("Centros Culturales", "archivos/vectores/dataSHP_CC_mod.geojson");
    cargarCapaPuntos("Centros Interactivos", "archivos/vectores/dataSHP_CDC_CI_mod.geojson");
    cargarCapaPuntos("Centros de Artes y Oficios", "archivos/vectores/dataSHP_CAO_mod.geojson")
});
