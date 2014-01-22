var map_container = document.getElementById('map-canvas'),
    counties = null,
    current_towns = null,
    old_counties = [],
    town_schools = [];

var geojson;
var popup = L.popup();

$(document).ready(function () {
    handleRoutes();
    $('#go-back').hide();
    var main = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data © OpenStreetMap contributors',
                minZoom: 10,
                maxZoom: 16,
            });
        counties = L.layerGroup(),
        current_towns = L.layerGroup();

    window.map = L.map('map-canvas', {
        center: [43.16412, -77.60124], //[42.6501, -76.3659],
        zoom: 12,
        layers: [
            main
         ]
    });

    new L.Control.GeoSearch({
        provider: new L.GeoSearch.Provider.Esri(),
        showMarker: true
    }).addTo(map)
    
    displayCounties();

    map.on('click', onClick);

    $('#modal').modal('show');

});

function onClick(e){    
    popup
    .setLatLng(e.latlng)
    .setContent(e.latlng.toString())
    .openOn(map);
}

function displayCounties() {
    for(var town in current_towns._layers) {
        map.removeLayer(current_towns._layers[town]);
    }
    loadCounties();
}

function loadCounties() {
    map.setZoom(7);
    window.setTimeout(function () {
        map.panTo([43.12504316740127, -77.740380859375]);
        map.setZoom(11);
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
                    map.setZoom(10);

                    var name = feature.properties.NAMELSAD.toLowerCase().trim().replace(/\s/g,'_').replace('.', '');
                    var county_url = 'static/data/counties/' + name + "_towns.json",
                        school_url = 'static/data/schools/'  + name + ".json";
                    $.getJSON(county_url, function (data) {
                        loadTowns(data, layer);
                    });
                    $.getJSON(school_url, function (data) {
                        loadSchools(data, layer);
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
	layer.setStyle({ fillColor: 'blue' });
    schools.forEach(function (school) {
        school_marker = L.marker([school.GDTLAT, school.GDTLONG]).addTo(map);
        school_marker.info = school;
        school_marker.on('click', function (event) {
            var info = event.target.info;
            console.log(info);
            $('#dialog').empty();
            $('#dialog').append('<h3>' + info.NAME.toCamelCase() + '</h3>');
            $('#dialog').append('<h4>' + info.agency_name_public_school_2010_11.toCamelCase() + '</h3></hr>');
            $('#dialog').append('<h5>Address</h5>');
            $('#dialog').append('<address>' + info.STREET.toCamelCase() + '<br>' + info.CITY.toCamelCase() + ', ' + info.STATE + ' ' + info.ZIP5 + '</address>');
            $('#dialog').append('<h5>Phone Number</h5>');
            $('#dialog').append('<p style="margin-bottom:20px">' + String(info['phone_number_public_school_2010_1']).replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '($1) $2-$3') + '</p>');
            $('#dialog').append('<h5>School District</h5>');
            $('#dialog').append('<p style="margin-bottom:20px">' + info['agency_name_public_school_2010_11'].toCamelCase() + '</p>');
            $('#dialog').append('<h5>Enrollment Data</h5>');

            var numbers_table = "<table class='table'>";
            if (info['number_teachers'] > 0){
                numbers_table+=('<tr><td width="50%"> Faculty </td> <td> ' + info['number_teachers'] + '</td></tr>');
            }
            if (info['prek_enroll'] > 0){
                numbers_table+=('<tr><td> Pre-K </td> <td> ' + info['prek_enroll'] + '</td></tr>');
            }
            if (info['k_fullday_enroll' > 0]){
                numbers_table+=('<tr><td> Kindergarten </td> <td> ' + (info['k_fullday_enroll'] + info['k_halfday_enroll']) + '</td></tr>');
            }
            for (x = 1; x < 13; x++){
                if (info['grade_' + x + '_enroll'] > 0){
                    numbers_table+=('<tr><td> Grade ' + x + ' </td> <td> ' + info['grade_' + x + '_enroll'] + '</td></tr>');
                }
            }
            numbers_table+=('</table>');
            $('#dialog').append(numbers_table);

            //$('#dialog').append('<button class="btn btn-primary" id="go-back" onclick="displayCounties()">Back</button>');
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
            return {color: 'blue', opacity: .1, fillOpacity: 0};
        },
        onEachFeature: function (feature, layer) {
            current_towns.addLayer(layer);
        },
    }).addTo(map);
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#00FF00',
        dashArray: '',
        fillOpacity: 0.7
    });

    //if (!L.Browser.ie && !L.Browser.opera) {
    //    layer.bringToFront();
    //}
}

function resetHighlight(e) {

    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#FF0000',
        dashArray: '',
        fillOpacity: 0.7
    });

    //console.log(Object.getOwnPropertyNames(e.target));
    //geojson.resetStyle(e.target);
}

function displayMonroe() {

    //geojson = L.geoJson();

    //$.getJSON('static/data/monroe_over_50k_dot_data.json', function (data) {
    $.getJSON('static/data/monroe_final.json', function (data) {
        //var count = 0;
        console.log('Number of Routes = ' + data.length);
        //var j = 0;
        for(var j=0; j<data.length;j++) {

            if (data[j]['traffic_volume'] > 50000) {
                var result = [];
                var last = null;
                if( data[j].route_path != undefined ) {
                    //console.log("drawing path ...");
                    //console.log(data[j]);
                    //console.log('route_path:');
                    //console.log(data[j].route_path);
                    for( var i=0; i<data[j].route_path.length; i+=2 ) {
                        //if (route.route_path[i] != undefined ) {
                            var lat = data[j].route_path[i];
                            var lng = data[j].route_path[i+1];
                            //console.log(lat + ', ' + lng);
                            var c = new L.latLng(lat, lng);
                            result.push(c)
                            //if(last != null) {
                            //    result.push([last, c]);
                            //} else {
                            //    last = c;
                            //}
                        //}
                    }
                    //console.log('result:');
                    //console.log(result);
                    //window.a = new L.multiPolyline([result], {color: 'red', weight: 8}).addTo(map);
                    var path = new L.multiPolyline([result], {color: 'red', weight: 8}).addTo(map);
                    var html = "<div>";
                    html += "<b>RC ID:</b> " + data[j].rc_id + "</br>";
                    html += "<b>Road:</b> " + data[j].name + "</br>";
                    html += "<b>Start Desc:</b> " + data[j].begin_description + "</br>";
                    html += "<b>Start Location:</b> " + data[j].begin_loc + "</br>";
                    html += "<b>End Desc:</b> " + data[j].end_description + "</br>";
                    html += "<b>End Location:</b> " + data[j].end_loc + "</br>";
                    html += "</div>";
                    path.bindPopup(html);
                    path.on({mouseover: highlightFeature, mouseout: resetHighlight});
                }
                else {
                    console.log('item #' + i + ' was undefined ... skipping.');
                }
            }
            //window.a = new L.multiPolyline(result, {color: 'red', weight: 8}).addTo(map);

            //count++;
            //if( count == 3 ) {
            //    break;
            //}
        }
    });
}

function handleRoutes () {

    displayMonroe();

    /*
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

   */
}

/* Helper Functions */


//
// SOlution provided via:
//  http://stackoverflow.com/a/5574446
//
String.prototype.toCamelCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

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
