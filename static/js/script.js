var map_container = document.getElementById('map-canvas');

var map = L.map('map-canvas', {
	center: [43.1850, -77.6115],
	zoom: 12,
	layers: [
	 new L.TileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
                attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
                maxZoom: 18,
                subdomains: '1234'
    	})
	 ]
})
