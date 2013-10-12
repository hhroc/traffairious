function initialize() {
	var mapOptions = {
		zoom: 8,
		center: new google.maps.LatLng(-34.397, 150.644),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions),
		url = 'http://maps.googleapis.com/maps/api/directions/json?origin=PENFIELD RD ROCHESTER NY&destination=DALE RD ROCHESTER NY&sensor=false';
	$.getJSON(url, function (data) {
		console.log(data, map);
	});
}

function displayDirections(data, map) {
	var directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(map);

	var start = 'PENFIELD RD ROCHESTER NY',
		end = 'DALE RD ROCHESTER NY';

	var request = {
		origin: start,
		destination: end,
		travelMode: google.maps.TravelMode.DRIVING
	}

	
}



window.onload = initialize;