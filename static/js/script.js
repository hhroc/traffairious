var map_container = document.getElementById('map-canvas');



$(document).ready(function () {
    var main = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data © OpenStreetMap contributors',
                minZoom: 5, 
                maxZoom: 18,
        })

    window.map = L.map('map-canvas', {
        center: [43.1850, -77.6115],
        zoom: 10,
        layers: [
            main
         ]
    })

    $.getJSON('static/data/nys_counties.json', function (data) {
        L.geoJson(data, {
            style: function (feature) {
                return {fillColor: 'blue', color: 'white', opacity: 1, fillOpacity: 0.4};
            },
            onEachFeature: function (feature, layer) {
                layer.on('click', function (event) {
                    var url = 'static/data/counties/' + feature.properties.NAMELSAD.toLowerCase().replace(' ','_') + "_towns.json";
                    $.getJSON(url, function (data) {
                        console.log(data);
                    });
                });
                layer.on('mouseover', function (event) {
                    layer._path.attributes.fill.nodeValue = "red";
                    $('#ui-id-1').text('Traffairious - ' + feature.properties.NAMELSAD);
                });
                layer.on('mouseout', function (event) {
                    layer._path.attributes.fill.nodeValue = "blue";
                });
            },

        }).addTo(map);
    });

    $( "#dialog" ).dialog( {width: 400, height: $(window).height()*.9, position: { my: "right", at: "right", of: window } } );
});

//name.tolower().replace(' ','_') + "_towns.json"