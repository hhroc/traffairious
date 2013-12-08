<%inherit file="master.mak" />
<div class="col-md-10" id="map-canvas"></div>
<div id="dialog" class="col-md-2">
	<div title="title">Traffairious</div>
    <button id="go-back" onclick="displayCounties()">Back</button>
</div>
<%def name="scripts()">
    <script src="http://cdn.leafletjs.com/leaflet-0.7/leaflet.js"></script>
    <script src="/static/js/utilities.js"></script>
    <script src="/static/js/script.js"></script>
</%def>
