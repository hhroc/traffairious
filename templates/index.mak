<%inherit file="master.mak" />
<div id="map-canvas" class="mapbox"></div>

<%def name="scripts()">
  <script type="text/javascript"
  src="https://maps.googleapis.com/maps/api/js?key=${api_key}&sensor=false"></script>
  <script src="/static/js/gmaps.js"></script>
  <script src="/static/js/utilities.js"></script>
  <script src="/static/js/script.js"></script>
</%def>
