// Crear una variable global para el mapa (será usada en otros scripts)
var map;

// Espera a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener("DOMContentLoaded", function () {

    // Verifica si la librería Leaflet está disponible
    if (typeof L === "undefined") {
        console.error("Leaflet no se ha cargado correctamente.");
        return;
    }

    // Inicializa el mapa centrado en una ubicación específica 
    map = L.map('map', {
        center: [19.344796609, -99.238588729], // Coordenadas iniciales del centro del mapa
        zoom: 14,               // Nivel de zoom inicial
        minZoom: 10,            // Nivel mínimo de zoom permitido
        maxZoom: 23,            // Nivel máximo de zoom permitido
        zoomControl: false,     // Desactiva el control de zoom predeterminado 
        tap: false              // Desactiva eventos táctiles 
    });

    // Agrega una capa base
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; OpenStreetMap contributors',
        minZoom: 10,
        maxZoom: 23
    }).addTo(map);

    // Agrega el control de zoom personalizado en la esquina superior derecha
    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    // Mensaje en consola para confirmar que el mapa está listo
    console.log("Mapa inicializado correctamente, esperando capa de colonias...");
});
