var map_container = document.getElementById('map-canvas'),
    counties = null,
    current_towns = null,
    old_counties = [],
    town_schools = [];

var geojson;
var popup = L.popup();

var lineWeight = 20;


//
//  Taken from:
//    http://stackoverflow.com/a/2901298
//
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$(document).ready(function () {
    //handleRoutes();

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

    L.control.scale({
        position: 'bottomright',
        metric: false,
        imperial: true
    }).addTo(map);

    new L.Control.GeoSearch({
        provider: new L.GeoSearch.Provider.Esri(),
        showMarker: true
    }).addTo(map)
    
    //displayCounties();

    //map.on('click', onClick);

    $('#modal').modal('show');

    //loadCounties();

    var school_url = "static/data/schools/monroe_county.json"
    $.getJSON(school_url, function (data) {
        loadSchools(data, '');
    });

    loadRouteData();

    //map.on('click', onClick);

    //map.bringToFront();

});

//
// DEBUG FUNCTIONS
//

var lastClick = "";

var routes = []
var routeIndex = -1;
var points = [];
var existingPoints = [];

var debugData = {};

function loadRouteData() {

    //$.getJSON('static/data/monroe_raw_25k.json', function (data) {

    //routes = data;

    //console.log('here');

    //$('#dialog').empty();
    //nextRoute();

    //});

    $.getJSON('static/data/monroe_point_list_25k_final.json', function (data) {

        //existingPoints = data;

        console.log('loading 25k-50k points');

        for(var i=0; i<data.length; i++) {
            var line = [];
            for( var j=0; j<data[i].points.length; j++ ) {
                var lat = parseFloat(data[i].points[j].split(',')[0].trim());
                var lng = parseFloat(data[i].points[j].split(',')[1].trim());
                //console.log('lat: ' + lat + ', lng: ' + lng);
                var c = new L.latLng(lat, lng);
                line.push(c);
            }

            var path = new L.multiPolyline([line], {color: 'purple', weight: lineWeight}).addTo(map);
            var html = "<div>";
            html += "<b>ID:</b> " + data[i].rc_id + "</br>";
            html += "<b>Volume: </b> " + numberWithCommas(data[i].volume) + " cars/day</br>";
            path.bindPopup(html);
            path.on({mouseover: highlightFeature25k, mouseout: resetHighlight25k});

        }

        console.log('25k+ points loaded successfully.');

    });

    $.getJSON('static/data/monroe_point_list_50k_final.json', function (data) {

    //existingPoints = data;

        console.log('loading 50k+ points');

        for(var i=0; i<data.length; i++) {
            var line = [];
            for( var j=0; j<data[i].points.length; j++ ) {
                var lat = parseFloat(data[i].points[j].split(',')[0].trim());
                var lng = parseFloat(data[i].points[j].split(',')[1].trim());
                //console.log('lat: ' + lat + ', lng: ' + lng);
                var c = new L.latLng(lat, lng);
                line.push(c);
            }

            //console.log(line);
 
            var path = new L.multiPolyline([line], {color: 'red', weight: lineWeight}).addTo(map);
            var html = "<div>";
            html += "<b>ID:</b> " + data[i].id + "</br>";
            html += "<b>Volume: </b> " + numberWithCommas(data[i].volume) + " cars/day</br>";
            path.bindPopup(html);
            path.on({mouseover: highlightFeature50k, mouseout: resetHighlight50k});

           //console.log(path);
  
        }

    });

}

/*
function nextRoute() {

    // save data
    if ( routeIndex > -1 ) {
        routes[routeIndex].points = points;
        //console.log(routes);
    }
    
    routeIndex++;

    var html = "<div>";
    html += "<b>RC ID:</b></br> " + routes[routeIndex].rc_id + "</br>";
    html += "<b>Road:</b></br> " + routes[routeIndex].name + "</br>";
    html += "<b>Start Desc:</b></br> " + routes[routeIndex].begin_description + "</br>";
    //html += "<b>Start Location:</b></br> " + routes[routeIndex].begin_loc + "</br>";
    html += "<b>End Desc:</b></br> " + routes[routeIndex].end_description + "</br>";
    //html += "<b>End Location:</b></br> " + routes[routeIndex].end_loc + "</br>";
    html += "</div>";

    //console.log(html);

    $("#routedebug").html(html);
    $("#dialog").show();
    $("#routedebug").show();
   
    var line = [];
    for( var i=0; i<points.length; i++ ) {
        var lat = parseFloat(points[i].split(',')[0].trim());
        var lng = parseFloat(points[i].split(',')[1].trim());
        console.log('lat: ' + lat + ', lng: ' + lng);
        var c = new L.latLng(lat, lng);
        line.push(c);
    }   
    var path = new L.multiPolyline([line], {color: 'purple', weight: 5}).addTo(map);
    html = "";
    html += "<b>RC ID:</b> " + routes[routeIndex].rc_id + "</br>";
    html += "<b>Road:</b> " + routes[routeIndex].name + "</br>";
    html += "<b>Start Desc:</b> " + routes[routeIndex].begin_description + "</br>";
    html += "<b>Start Location:</b> " + points[0] + "</br>";
    html += "<b>End Desc:</b> " + routes[routeIndex].end_description + "</br>";
    html += "<b>End Location:</b> " + points[points.length-1] + "</br>";
    html += "</div>";
    path.bindPopup(html);
    path.on({mouseover: highlightFeature, mouseout: resetHighlight});

    clearPoints();

    

}
*/

function onClick(e){    
    popup
    .setLatLng(e.latlng)
    .setContent(e.latlng.toString())
    .openOn(map);

    var latlng = e.latlng.toString().replace('LatLng(','').replace(')','');
    points.push(latlng);

    //routes[routeIndex].points = points;

    //displayPoints();

    //var 

    var LATFC = 364637;
    var LNGFC = 250000;

    if ( lastClick != "" ) {

        //
        // modified from here: http://andrew.hedges.name/experiments/haversine/
        //

        var t1 = parseFloat(latlng.split(',')[0].trim());
        var n1 = parseFloat(latlng.split(',')[1].trim());

        var t2 = parseFloat(lastClick.split(',')[0].trim());
        var n2 = parseFloat(lastClick.split(',')[1].trim());

	/*

        var dlat = lat2 - lat1; 
        var dlon = lon2 - lon1;

        R = 
        var a = Math.pow(Math.sin(dlat/2),2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon/2),2);
        var c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1-a) );
        var d = R * c;

        //var d = Math.sqrt(Math.pow(clat-llat,2) + Math.pow(clng-llng,2));

	*/

	d = findDistance(t1,n1,t2,n2);

        console.log( "distance: " + d );

    }

    lastClick = latlng

}

	//
	// taken from: http://andrew.hedges.name/experiments/haversine/
	//

	/* main function */
	function findDistance(t1,n1,t2,n2) {

		var Rm = 3961; // mean radius of the earth (miles) at 39 degrees from the equator
		var Rk = 6373; // mean radius of the earth (km) at 39 degrees from the equator

		var t1, n1, t2, n2, lat1,lon1,lat2,lon2, dlat, dlon, a, c, dm, dk, mi, km, dist;
		
		// get values for lat1, lon1, lat2, and lon2
		//t1 = frm.lat1.value;
		//n1 = frm.lon1.value;
		//t2 = frm.lat2.value;
		//n2 = frm.lon2.value;
		
		// convert coordinates to radians
		lat1 = deg2rad(t1);
		lon1 = deg2rad(n1);
		lat2 = deg2rad(t2);
		lon2 = deg2rad(n2);
		
		// find the differences between the coordinates
		dlat = lat2 - lat1;
		dlon = lon2 - lon1;
		
		// here's the heavy lifting
		a  = Math.pow(Math.sin(dlat/2),2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon/2),2);
		c  = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); // great circle distance in radians
		dm = c * Rm; // great circle distance in miles
		dk = c * Rk; // great circle distance in km
		
		// round the results down to the nearest 1/1000
		mi = round(dm);
		km = round(dk);
		
		// display the result
		dist = mi * 5280;
		//frm.km.value = km;

		return dist;
	}
	
	
	// convert degrees to radians
	function deg2rad(deg) {
		rad = deg * Math.PI/180; // radians = degrees * pi/180
		return rad;
	}
	
	
	// round to the nearest 1/1000
	function round(x) {
		return Math.round( x * 1000) / 1000;
	}

function displayPoints() {
    if ( points.length == 0 ) {
        $('#routepoints').empty();
    }
    else {
        for(var j=0; j<routes.length; j++) {
            //if ( routes[j].points != undefined ) {
                var html = '{"rc_id": "' + routes[j].rc_id + '","points": [</br>';
                if ( points.length > 1 ) {
                    for(var i=0; i<points.length-1; i++) {
                        html += '"' + routes[j].points[i] + '",</br>';
                    }
                }
                html += '"' + points[points.length-1] + '"</br>';
                html += ']},</br>';
                $("#routepoints").html(html);
            //}
        }
    }
}

function clearPoints() {
    points = [];
    displayPoints();
} 

//
// END DEBUG FUNCTIONS
//


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
                    //counties.addLayer(layer);
                    map.setZoom(10);

                    var name = feature.properties.NAMELSAD.toLowerCase().trim().replace(/\s/g,'_').replace('.', '');
                    var county_url = 'static/data/counties/' + name + "_towns.json",
                        school_url = 'static/data/schools/'  + name + ".json";
                    $.getJSON(county_url, function (data) {
                        //loadTowns(data, layer);
                    });
                    $.getJSON(school_url, function (data) {
                        loadSchools(data, layer);
                    });
                    layer.on('mouseover', function (event) {
                        //layer.setStyle({ fillColor: 'red' });
                        //$('#title').text('Traffairious - ' + feature.properties.NAMELSAD);
                    });
                    layer.on('mouseout', function (event) {
                        //layer.setStyle({ fillColor: 'blue' });
                    });
                },
            }).addTo(map);
        });
	
    }
}

function loadSchools(schools, layer) {

    var cleanIcon = L.icon({
        iconUrl: 'static/img/marker-icon-blue.png',
        iconSize: [22, 27]
    });

    var dirtyIcon = L.icon({
        iconUrl: 'static/img/marker-icon-yellow.png',
        iconSize: [22, 27]
    });

    //layer.setStyle({ fillColor: 'blue' });
    schools.forEach(function (school) {
        var close = false;
        if ( school['close'] == undefined ) {
            school_marker = L.marker([school.GDTLAT, school.GDTLONG],{icon: cleanIcon}).addTo(map);
        }
        else {
            school_marker = L.marker([school.GDTLAT, school.GDTLONG],{icon: dirtyIcon}).addTo(map);
            close = true;
        }
	school_marker.info = school;
        school_marker.on('click', function (event) {
            var info = event.target.info;
            console.log(info);
            $('#dialog').empty();
            //$('#dialog').append('ID: ' + info.id + '</br>');
            if( close == true )
                $('#dialog').append("<h4 style=\"color: red;\">This School's address is within 1000 feet of a roadway with over 50,000 cars/day<h4>");
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
            return {color: 'blue', opacity: .18, fillOpacity: 0};
        },
        onEachFeature: function (feature, layer) {
            layer.on('click',onClick);
            current_towns.addLayer(layer);
        },
    }).addTo(map);
}

function highlightFeature50k(e) {
    var layer = e.target;

    layer.setStyle({
        weight: lineWeight,
        color: 'green',
        dashArray: '',
        fillOpacity: 0.7
    });
}

function resetHighlight50k(e) {

    var layer = e.target;

    layer.setStyle({
        weight: lineWeight,
        color: 'red',
        dashArray: '',
        fillOpacity: 0.7
    });
}

function highlightFeature25k(e) {
    var layer = e.target;

    layer.setStyle({
        weight: lineWeight,
        color: 'green',
        dashArray: '',
        fillOpacity: 0.7
    });
}

function resetHighlight25k(e) {

    var layer = e.target;

    layer.setStyle({
        weight: lineWeight,
        color: 'purple',
        dashArray: '',
        fillOpacity: 0.7
    });
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
                    var path = new L.multiPolyline([result], {color: 'red', weight: 5}).addTo(map);
                    var html = "<div>";
                    html += "<b>RC ID:</b> " + data[j].rc_id + "</br>";
                    html += "<b>Road:</b> " + data[j].name + "</br>";
                    html += "<b>Start Desc:</b> " + data[j].begin_description + "</br>";
                    html += "<b>Start Location:</b> " + data[j].begin_loc + "</br>";
                    html += "<b>End Desc:</b> " + data[j].end_description + "</br>";
                    html += "<b>End Location:</b> " + data[j].end_loc + "</br>";
                    html += "</div>";
                    path.bindPopup(html);
                    path.on({mouseover: highlightFeature50k, mouseout: resetHighlight50k});
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
