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

    displayCounties();

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
            $('#dialog').append('<h3>' + info.NAME + '</h3><hr>');
            $('#dialog').append('<h5>Address</h5>');
            $('#dialog').append('<address>' + info.STREET + '<br>' + info.CITY + ', ' + info.STATE + ' ' + info.ZIP5 + '</address>');
            $('#dialog').append('<h5>Phone Number</h5>');
            $('#dialog').append('<p style="margin-bottom:20px">' + String(info['phone_number_public_school_2010_1']).replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '($1) $2-$3') + '</p>');
            $('#dialog').append('<h5>School District</h5>');
            $('#dialog').append('<p style="margin-bottom:20px">' + info['agency_name_public_school_2010_11'] + '</p>');
            $('#dialog').append('<h5>Numbers</h5>');

            var numbers_table = "<table class='table'>";
    
            numbers_table+=('<tr><td width="50%"> Faculty </td> <td> ' + info['number_teachers'] + '</td></tr>');
            numbers_table+=('<tr><td> Pre-K </td> <td> ' + info['prek_enroll'] + '</td></tr>');
            numbers_table+=('<tr><td> Kindergarten </td> <td> ' + (info['k_fullday_enroll'] + info['k_halfday_enroll']) + '</td></tr>');
            numbers_table+=('<tr><td> Grade 1 </td> <td> ' + info['grade_1_enroll'] + '</td></tr>');
            numbers_table+=('<tr><td> Grade 2 </td> <td> ' + info['grade_2_enroll'] + '</td></tr>');
            numbers_table+=('<tr><td> Grade 3 </td> <td> ' + info['grade_3_enroll'] + '</td></tr>');
            numbers_table+=('<tr><td> Grade 4 </td> <td> ' + info['grade_4_enroll'] + '</td></tr>');
            numbers_table+=('<tr><td> Grade 5 </td> <td> ' + info['grade_5_enroll'] + '</td></tr>');
            numbers_table+=('<tr><td> Grade 6 </td> <td> ' + info['grade_6_enroll'] + '</td></tr>');
            numbers_table+=('<tr><td> Grade 7 </td> <td> ' + info['grade_7_enroll'] + '</td></tr>');
            numbers_table+=('<tr><td> Grade 8 </td> <td> ' + info['grade_8_enroll'] + '</td></tr>');
            numbers_table+=('<tr><td> Grade 9 </td> <td> ' + info['grade_9_enroll'] + '</td></tr>');
            numbers_table+=('<tr><td> Grade 10 </td> <td> ' + info['grade_10_enroll'] + '</td></tr>');
            numbers_table+=('<tr><td> Grade 11 </td> <td> ' + info['grade_11_enroll'] + '</td></tr>');
            numbers_table+=('<tr><td> Grade 12 </td> <td> ' + info['grade_12_enroll'] + '</td></tr>');
            numbers_table+=('</table>');
            $('#dialog').append(numbers_table);
            
            $('#dialog').append('<button class="btn btn-primary" id="go-back" onclick="displayCounties()">Back</button>');
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
