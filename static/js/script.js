var map_container = document.getElementById('map-canvas');

var map = L.map('map-canvas', {
	center: [43.1850, -77.6115],
	zoom: 12,
	layers: [
	 new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data © OpenStreetMap contributors',
                minZoom: 8, 
                maxZoom: 12,
    	})
	 ]
})
