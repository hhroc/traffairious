<%inherit file="master.mak" />
<div class="col-md-10" id="map-canvas"></div>
<div id="dialog" class="col-md-2">
	<div title="title">Traffairious</div>
    <button id="go-back" onclick="displayCounties()">Back</button>
</div>

<div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-center">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="myModalLabel"><center>Traffairious</center></h3>
            </div>
            <div class="modal-body">
                <p class="lead">
                    Phasellus sed tincidunt tortor. Pellentesque nec enim ante. Vivamus ut enim placerat, rhoncus libero eu, accumsan metus. Aliquam rutrum venenatis urna, tincidunt commodo dolor malesuada nec. Suspendisse elementum faucibus mollis. Donec laoreet ante non libero convallis, vel fringilla felis iaculis. Sed pharetra, odio vulputate placerat semper, turpis est sollicitudin nibh, id iaculis felis massa auctor turpis. 
                </p>
                <p class="lead">
                	Cras at ornare metus. Nullam luctus vel neque vel facilisis. Praesent porta ligula sit amet ipsum congue varius. Nam sed tincidunt tellus, sit amet faucibus nibh. Curabitur eu enim sit amet libero dictum facilisis vitae vitae enim. Vivamus odio lacus, malesuada vitae risus a, rutrum tincidunt nulla. Nullam vel mattis ligula, tincidunt tempor eros. Donec porta imperdiet velit et egestas. Morbi vitae hendrerit diam, in auctor est. Etiam at lectus tincidunt metus fermentum rutrum non nec sapien.
                </p>
            </div>
            <div class="modal-footer">
                <center><button type="button" class="btn btn-primary" data-dismiss="modal">Close</button></center>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<%def name="scripts()">
    <script src="/static/js/active-nav.js"></script>
    <script src="http://cdn.leafletjs.com/leaflet-0.7/leaflet.js"></script>
    <script src="/static/js/utilities.js"></script>
    <script src="/static/js/script.js"></script>
	<script src="/static/js/l.control.geosearch.js"></script>
	<script src="/static/js/l.geosearch.provider.esri.js"></script>
</%def>
