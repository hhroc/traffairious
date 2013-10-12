var directionsService = new google.maps.DirectionsService();

function initialize() {
    var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(-34.397, 150.644),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    var start = 'PENFIELD RD ROCHESTER NY',
        end = 'DALE RD ROCHESTER NY',
        start2 = 'CLOVER ST ROCHESTER NY',
        end2 = 'ALLENS CREEK ROCHESTER NY';

    displayDirections(map, start, end);
    displayDirections(map, start2, end2);

    getCSV('static/data/')
}

function displayDirections(map, start, end) {
    var polylineOptionsActual = {
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
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
        console.log('status: ', status)
        if (status == google.maps.DirectionsStatus.OK) {
            console.log('OK');
            directionsDisplay.setDirections(result);
        }
    }); 
}

function getCSV(filename) {
    var csvFile = new XMLHttpRequest();
    csvFile.open("GET", filename, true);
    csvFile.onreadystatechange = function()
    {
        var allText = csvFile.responseText;
        var csv = CSVToArray(allText)
        console.log(csv);
    };
}


window.onload = initialize;