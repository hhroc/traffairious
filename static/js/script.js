var directionsService = new google.maps.DirectionsService(),
    map,
    start,
    end,
    json = {'calls': []},
    total = 0;

function initialize() {
    var mapOptions = {
        div: '#map-canvas',
        lat: 43.1572899, 
        lng: -77.6230846
    }
    map = new GMaps(mapOptions);

    getCSV('static/data/Highway-Inventory-Monroe\ County-50Kplus.csv');
}

function initialize2() {
    getSchools('static/data/schools_all_NY.csv');
    var home = new google.maps.LatLng(43.1572899, -77.6230846);
    var mapOptions = {
        zoom:7,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: home
    }
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    //getCSV2('static/data/Highway-Inventory-Monroe\ County-50Kplus.csv');
}

function getSchools(filename) {
    $.ajax({
        type: "GET",
        Accept : "text/csv; charset=utf-8",
        "Content-Type": "text/csv; charset=utf-8",
        url: filename,
        success: function (data) {
            var object = ArrayToObject(CSVToArray(data));
            plotSchools(object);
            console.log(object);
        }
    });
}

function plotSchools(data) {
    for (var i = 0; i < data.GDTLONG.length; i++) {
        var lat = data.GDTLAT[i],
            lng = data.GDTLONG[i];
        var pos = new google.maps.LatLng(lat, lng);
        var marker = new google.maps.Marker({
            'map': map,
            position: pos,
            animation: false,
            clickable: true,
            title: data.NAME[i],
            flat: true
        });
    };
    
}

function displayDirections(map, begin, finish, color, x) {
    var request = {
        origin: begin,
        destination: finish,
        travelMode: google.maps.TravelMode.DRIVING
    }

    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
        }
    });

    color = color || '#FF0000';

    var polylineOptionsActual = {
        strokeColor: color,
        strokeOpacity: 0.5,
        strokeWeight: 5
    };

    var directionsDisplay = new google.maps.DirectionsRenderer(
        {
            suppressMarkers: true, 
            polylineOptions: polylineOptionsActual
        });

    directionsDisplay.setMap(map);


    if(x === 63) {
        console.log(JSON.stringify(json));
    }
}

function obtainDirections(map, begin, finish, color, x) {
    var request = {
        origin: begin,
        destination: finish,
        travelMode: google.maps.TravelMode.DRIVING
    }


    color = color || '#FF0000';

    var polylineOptionsActual = {
        strokeColor: color,
        strokeOpacity: 0.5,
        strokeWeight: 5
    };

    var directionsDisplay = new google.maps.DirectionsRenderer( {
            suppressMarkers: true, 
            polylineOptions: polylineOptionsActual
        }
    );
    
    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            console.log(result);
            directionsDisplay.setDirections(result);
        }
    });
    
    if(x === 63) {
        console.log(JSON.stringify(json));
    }
}

function getCSV(filename) {
    $.ajax({
        type: "GET",
        Accept : "text/csv; charset=utf-8",
        "Content-Type": "text/csv; charset=utf-8",
        url: filename,
        success: function (data) {
            var object = ArrayToObject(CSVToArray(data, "\t"));
            drawRoadsFromFile();
        }
    })
}

function getCSV2(filename) {
    $.ajax({
        type: "GET",
        Accept : "text/csv; charset=utf-8",
        "Content-Type": "text/csv; charset=utf-8",
        url: filename,
        success: function (data) {
            var object = ArrayToObject(CSVToArray(data, "\t"));
            drawRoads(object);
        }
    });
}

function saveData(start, end, x) {
    url = 'http://maps.googleapis.com/maps/api/directions/json?origin=' + start 
        + ' &destination=' + end + '&sensor=false'; 
    url = url.replace(/ /gi, '%20');
    console.log(url);
    $.getJSON(url, function (data) {
        json.calls.push(data);
        console.log(x);
    });
}

function drawRoadsFromFile() {
    $.getJSON('/static/data/highway-data.json', function (data) {
        for (var i = 0; i < data.calls.length; i++) {
            var call = data.calls[i],
                path = [];
            console.log(call);
            for (var j = 0; j < call.routes[0].legs[0].steps.length; j++) {
                console.log(call.routes[0].legs[0].steps[j].start_location);
                var step = call.routes[0].legs[0].steps[j].start_location;
                path.push([step.lb, step.mb]);
            }
            var last = call.routes[0].legs[0].steps[call.routes[0].legs[0].steps.length - 1].end_location;
            path.push([last.lb, last.mb]);
            map.drawPolyline({
              path: path,
              strokeColor: '#131540',
              strokeOpacity: 0.6,
              strokeWeight: 6
            });
        }
    });
}

function drawRoads(object) {
    var x = 0;
    for (var i = 0; i < object.AADT.length; i++) {
        setTimeout(function() {
            start = object.From[x];
            end = object.To[x];
            if (start != '' && end != '') {
                start = start + ' ROCHESTER, NY';
                end = end + ' ROCHESTER, NY';
                displayDirections(map, start, end, '#FF0000', x);
                total++;
                console.log(total);
            }//end if
            x++;
        }, 1000 + (i * 1000)); //end setTimeout
    }// end for
}



window.onload = initialize2;
