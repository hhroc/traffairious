<%inherit file="master.mak" />
<div id="map-canvas"></div>
<div id="dialog" title="traffairious">
    <p>Hi There</p>
    <button id="go-back" onclick="displayCounties()">Back</button>
</div>
<%def name="scripts()">
    <script src="http://cdn.leafletjs.com/leaflet-0.7/leaflet.js"></script>
    <script src="/static/js/utilities.js"></script>
    <script src="/static/js/script.js"></script>
</%def>
