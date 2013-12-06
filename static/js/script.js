var map_container = document.getElementById('map-canvas');


var map = L.map('map-canvas', {
    center: [43.1850, -77.6115],
    zoom: 10,
    layers: [
     new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data © OpenStreetMap contributors',
                minZoom: 5, 
                maxZoom: 18,
        })
     ]
})

$.getJSON('static/data/nys_counties.json', function (data) {
    L.geoJson(data, {
        style: function (feature) {
            return {fillColor: 'blue', color: 'white', opacity: 1, fillOpacity: 0.4};
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.NAMELSAD);
        },

    }).addTo(map);
});
