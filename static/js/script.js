var map_container = document.getElementById('map-canvas'),
    counties = null,
    current_towns = null,
    old_counties = [],
    town_schools = [];



$(document).ready(function () {
    handleRoutes();
    $('#go-back').hide();
    var main = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data © OpenStreetMap contributors',
                minZoom: 5,
                maxZoom: 18,
            });
        counties = L.layerGroup(),
        current_towns = L.layerGroup();

    window.map = L.map('map-canvas', {
        center: [42.6501, -76.3659],
        zoom: 7,
        layers: [
            main
         ]
    });

    //displayCounties();

});

function displayCounties() {
    for(var town in current_towns._layers) {
        map.removeLayer(current_towns._layers[town]);
    }
    loadCounties();
}

function loadCounties() {
    map.setZoom(7);
    window.setTimeout(function () {
        map.panTo([42.6501, -76.3659]);
    }, 800);
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
                        window.setTimeout(function () {
                            map.setZoom(10);
                        }, 800);
                        map.panTo([event.latlng.lat, event.latlng.lng]);
                        console.log(event);
                        var name = feature.properties.NAMELSAD.toLowerCase().trim().replace(/\s/g,'_').replace('.', '');
                        var county_url = 'static/data/counties/' + name + "_towns.json",
                            school_url = 'static/data/schools/'  + name + ".json";
                        $.getJSON(county_url, function (data) {
                            loadTowns(data, layer);
                        });
                        $.getJSON(school_url, function (data) {
                            loadSchools(data, layer);
                        });
                    });
                    layer.on('mouseover', function (event) {
                        layer.setStyle({ fillColor: 'red' });
                        $('#title').text('Traffairious - ' + feature.properties.NAMELSAD);
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
            for (var i = 1; i < 13; i++){
                if (info['grade_' + i + '_enroll']){
                    $('#dialog').append('<li>' + 'Grade ' + i + ': ' + info['grade_' + i + '_enroll'] + '</li>');
                }
            }
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

function handleRoutes () {
    $.getJSON('static/data/routes.json', function (data) {
        //data.forEach(function (route) {
            var route = data[1];
            var result = [];
            var coords = decompress(route.location, 6);
            if (coords.length > 10) {
                len = 10;
            } else {
                len = coords.length;
            }
            var last = null;
            for (var i = 0; i < len; i += 2) {
                var lat = coords[i],
                    lng = coords[i + 1];
                var c = new L.latLng([lat, lng]);
                if(last != null) {
                    result.push([last, c]);
                } else {
                    last = c;
                }
            };
            window.a = new L.multiPolyline(result, {color: 'red', weight: 8}).addTo(map);
        //});
    });
}


function decompress (encoded, precision) {
   precision = Math.pow(10, -precision);
   var len = encoded.length, index=0, lat=0, lng = 0, array = [];
   while (index < len) {
      var b, shift = 0, result = 0;
      do {
         b = encoded.charCodeAt(index++) - 63;
         result |= (b & 0x1f) << shift;
         shift += 5;
      } while (b >= 0x20);
      var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;
      shift = 0;
      result = 0;
      do {
         b = encoded.charCodeAt(index++) - 63;
         result |= (b & 0x1f) << shift;
         shift += 5;
      } while (b >= 0x20);
      var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;
      array.push(lat * precision);
      array.push(lng * precision);
   }
   return array;
}