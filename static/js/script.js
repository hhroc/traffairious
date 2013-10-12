var directionsService = new google.maps.DirectionsService(),
    map;

function initialize() {
    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(-34.397, 150.644),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    getCSV('static/data/Highway-Inventory-Monroe\ County-50Kplus.csv');
}

function displayDirections(map, start, end, color) {
    color = color || '#FF0000'
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

    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    }

    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
        }
    }); 
}

function drawRoads(object) {
    for (var i = 0; i < object.AADT.length; i++) {
        var start = object.From[i],
            end = object.To[i];
        if (start != '' && end != '') {
            console.log(start + ' --- ' + end);
            start = start + ' ROCHESTER, NY';
            end = end + ' ROCHESTER, NY';
            displayDirections(map, start, end);
        };
    };
}

function getCSV(filename) {
    $.ajax({
        type: "GET",
        Accept : "text/csv; charset=utf-8",
        "Content-Type": "text/csv; charset=utf-8",
        url: filename,
        success: function (data) {
            var object = ArrayToObject(CSVToArray(data, "\t"));
            console.log(object);
            drawRoads(object);
        }
    })
}


window.onload = initialize;