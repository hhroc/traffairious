var map_container = document.getElementById('map-canvas'),
    counties = null,
    current_towns = null;



$(document).ready(function () {
    $('#go-back').hide();
    var main = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data © OpenStreetMap contributors',
                minZoom: 5, 
                maxZoom: 18,
            });
        counties = L.layerGroup(),
        current_towns = L.layerGroup();

    window.map = L.map('map-canvas', {
        center: [43.1850, -77.6115],
        zoom: 10,
        layers: [
            main
         ]
    });

    displayCounties();

    $( "#dialog" ).dialog( {width: 400, height: $(window).height()*.9, position: { my: "right", at: "right", of: window } } );
});

function displayCounties() {
    for(var town in current_towns._layers) {
        map.removeLayer(current_towns._layers[town]);
    }
    loadCounties();
}

function loadCounties() {
    $.getJSON('static/data/nys_counties.json', function (data) {
        L.geoJson(data, {
            style: function (feature) {
                return {fillColor: 'blue', color: 'white', opacity: 1, fillOpacity: 0.4};
            },
            onEachFeature: function (feature, layer) {
                counties.addLayer(layer);
                layer.on('click', function (event) {
                    var url = 'static/data/counties/' + feature.properties.NAMELSAD.toLowerCase().replace(' ','_') + "_towns.json";
                    $.getJSON(url, function (data) {
                        loadTowns(data, layer);
                    });
                });
                layer.on('mouseover', function (event) {
                    layer.setStyle({ fillColor: 'red' });
                    $('#ui-id-1').text('Traffairious - ' + feature.properties.NAMELSAD);
                });
                layer.on('mouseout', function (event) {
                    layer.setStyle({ fillColor: 'blue' });
                });
            },
        }).addTo(map);
    });
}

function loadTowns (data, county) {
    $('#go-back').show();
    var index = -1;
    for(var i=0; i < data.features.length; i++) {
        if (data.features[i].properties.COUSUBFP == "00000") {
            index = i;
            break;
        }
    }
    if (index != -1) {
        data.features.splice(index, 1);
    }

    for(var county in counties._layers) {
        map.removeLayer(counties._layers[county]);
    }

    L.geoJson(data, {
        style: function (feature) {
            return {fillColor: 'blue', color: 'white', opacity: 1, fillOpacity: 0.4};
        },
        onEachFeature: function (feature, layer) {
            current_towns.addLayer(layer);
            layer.on('mouseover', function (event) {
                layer.setStyle({ fillColor: 'red' });
            });
            layer.on('mouseout', function (event) {
                layer.setStyle({ fillColor: 'blue' });
            });
        },
    }).addTo(map);
}

//name.tolower().replace(' ','_') + "_towns.json"