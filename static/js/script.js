var map_container = document.getElementById('map-canvas'),
    counties = null,
    current_towns = null,
    old_counties = [],
    town_schools = [];



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
    if (old_counties.length != 0) {
        for(var county in old_counties) {
            map.addLayer(old_counties[county]);
        }

        for(var marker in town_schools) {
            map.removeLayer(town_schools[marker]);
        }
    } else {
        $.getJSON('static/data/nys_counties.json', function (data) {
            L.geoJson(data, {
                style: function (feature) {
                    return {fillColor: 'blue', color: 'white', opacity: 1, fillOpacity: 0.4};
                },
                onEachFeature: function (feature, layer) {
                    counties.addLayer(layer);
                    layer.on('click', function (event) {
                        var county_url = 'static/data/counties/' + feature.properties.NAMELSAD.toLowerCase().replace(' ','_') + "_towns.json",
                            school_url = 'static/data/schools/'  + feature.properties.NAMELSAD.toLowerCase().replace(' ','_') + ".json";
                        $.getJSON(county_url, function (data) {
                            loadTowns(data, layer);
                        });
                        $.getJSON(school_url, function (data) {
                            loadSchools(data, layer);
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
}

function loadSchools(schools, layer) {
    schools.forEach(function (school) {
        school_marker = L.marker([school.GDTLAT, school.GDTLONG]).addTo(map);
        school_marker.info = school;
        school_marker.on('click', function (event) {
            var info = event.target.info;
            console.log(info);
            $('#dialog').empty();
            $('#dialog').append('<h2>' + info.NAME + '</h2>');
            var address = [info.STREET, info.CITY, info.STATE, info.ZIP5].join(' ');
            $('#dialog').append('<h4>' + address + '</h4>');
            $('#dialog').append('<p>' + info['agency_name_public_school_2010_11'] + '</p>');

            //TODO: Read in list of grads and list them
            // <ul> - creates list
            // <li> - list item
            // info['key']
            $('#dialog').append('Enrollment');
            $('#dialog').append('<ul>');
            $('#dialog').append('<li>' + 'Grade 1: ' + info['grade_1_enroll'] + '</li>');
            $('#dialog').append('<li>' + 'Grade 2: ' + info['grade_2_enroll'] + '</li>');
            $('#dialog').append('<li>' + 'Grade 3: ' + info['grade_3_enroll'] + '</li>');
            $('#dialog').append('<li>' + 'Grade 4: ' + info['grade_4_enroll'] + '</li>');
            $('#dialog').append('<li>' + 'Grade 5: ' + info['grade_5_enroll'] + '</li>');
            $('#dialog').append('<li>' + 'Grade 6: ' + info['grade_6_enroll'] + '</li>');
            $('#dialog').append('<li>' + 'Grade 7: ' + info['grade_7_enroll'] + '</li>');
            $('#dialog').append('<li>' + 'Grade 8: ' + info['grade_8_enroll'] + '</li>');
            $('#dialog').append('<li>' + 'Grade 9: ' + info['grade_9_enroll'] + '</li>');
            $('#dialog').append('<li>' + 'Grade 10: ' + info['grade_10_enroll'] + '</li>');
            $('#dialog').append('<li>' + 'Grade 11: ' + info['grade_11_enroll'] + '</li>');
            $('#dialog').append('<li>' + 'Grade 12: ' + info['grade_12_enroll'] + '</li>');
            $('#dialog').append('</ul>');

            $('#dialog').append('<button id="go-back" onclick="displayCounties()">Back</button>');
        });
        town_schools.push(school_marker);
    });
}

function loadTowns (data, county) {
    old_counties = [];
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
        old_counties.push(counties._layers[county]);
        map.removeLayer(counties._layers[county]);
    }

    L.geoJson(data, {
        style: function (feature) {
            return {color: 'red', opacity: 1, fillOpacity: 0};
        },
        onEachFeature: function (feature, layer) {
            current_towns.addLayer(layer);
        },
    }).addTo(map);
}

//name.tolower().replace(' ','_') + "_towns.json"
