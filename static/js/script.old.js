var directionsService = new google.maps.DirectionsService(),
    map,
    start,
    end,
    json = {'calls': []},
    total = 0,
    aadt = [52800, 54100, 54100, 54400, 54600, 57200, 57200, 57300, 60000, 61100, 61100, 62700, 62700, 62700, 64900, 64900, 65100, 65100, 65600, 71300, 71500, 75300, 75700, 75700, 75700, 75700, 75700, 75700, 76600, 76700, 76700, 76700, 80300, 80300, 82100, 83400, 83700, 83700, 84200, 84500, 85000, 85400, 86900, 88000, 92500, 94400, 94400, 94400, 95700, 95700, 98800, 99600, 99600, 99700, 99700, 99700, 104400, 109600, 134100, 134100, 134100, 134100];

aadt = convertNumbers(aadt, 52800, 134100);
function initialize() {
    var winHeight = $(window).height() - $('.navbar').height() - 20;
    console.log(winHeight);
    $('.mapbox').height(winHeight);;
    getSchools('static/data/schools_all_NY.csv');
    var mapOptions = {
        div: '#map-canvas',
        lat: 43.1572899, 
        lng: -77.6230846,
        zoom: 13
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
    getCSV2('static/data/Highway-Inventory-Monroe\ County-50Kplus.csv');
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
        //var pos = new google.maps.LatLng(lat, lng);
        var infoWindow = new google.maps.InfoWindow({
            content: '<div id="content">'+
          '<h1 id="firstHeading" class="firstHeading" style="font-size: 26px;">'+data.NAME[i]+'</h1>'+
          '<div id="bodyContent">'+
          '<p>' + data.STREET[i] + ', ' + data.CITY[i] + ', ' + data.STATE[i] + '</p>' +
          '</div>'+
          '</div>'
        });
        map.addMarker({
            lat: data.GDTLAT[i],
            lng: data.GDTLONG[i],
            title: data.NAME[i],
            infoWindow: infoWindow
        });
        /*var marker = new google.maps.Marker({
            'map': map,
            position: pos,
            animation: false,
            clickable: true,
            title: data.NAME[i],
            flat: true
        });*/
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
            drawRoads2(object);
        }
    });
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
            if(call.routes[0] == undefined || call.routes[0].overview_path == undefined) {
                continue;
            }
            console.log('dsag');
            for (var j = 0; j < call.routes[0].overview_path.length; j++) {
                var step = call.routes[0].overview_path[j];
                path.push([step.lb, step.mb]);
            }
            r = aadt[i];
            b = 255 - aadt[i];
            map.drawPolyline({
              path: path,
              strokeColor: 'rgb(' + r + ',0,' + b + ')',
              strokeOpacity: 0.6,
              strokeWeight: 8
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

function drawRoads2(object) {
    console.log(object);
    var x = 0;
    for (var i = 0; i < object.AADT.length; i++) {
        start = object.From[x];
        end = object.To[x];
        if (start != '' && end != '') {
            object.From[x] = start + ' ROCHESTER, NY';
            object.To[x] = end + ' ROCHESTER, NY';
            json.calls.push(object.AADT[i]);
            total++;
            console.log(total);
        }//end if
        x++;
    }// end for
}


window.onload = initialize;
