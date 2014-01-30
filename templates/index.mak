<%inherit file="master.mak" />
<div class="col-md-10" id="map-canvas"></div>
<div id="dialog" class="col-md-2">
	<div title="title"></br><center><b>Click a school icon on the map to display information about it.</b></center></div></br>
        <div id="routedebug"></div></br>
        <button id="nextroute" onclick="nextRoute()">Next</button>
        </br></br><div id="routepoints"></div></br></br>
    <!--<button id="go-back" onclick="displayCounties()">Back</button>-->
</div>

<div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-center">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="myModalLabel"><center>Traffairious</center></h3>
            </div>
            <div class="modal-body">
                
                <p class="lead">

                    This website privides a visual means to see the proximity of schools within Monroe County, NY to high traffic road ways.  This website was put together by members of <a href="http://www.meetup.com/HackshackersROC/">Hacks/Hackers Rochester</a> in colaboration with <a href="http://www.wxxi.org/">WXXI</a> and <a href="http://innovationtrail.org/">Innovation Trail</a>.

                </p>
                <p class="lead">
                    The map has one it markers to represent schools, and colored lines to represent high traffic roadways.

                    <div style="border: 2px solid purple; background-color: purple; width: 40px; height: 20px;border-radius: 10px;float: left;"></div>
                    <div style="margin-left: 50px;">Roadway with 25,000 - 49,999 cars per day.</div>

                    </br></br>
                    
                    <div style="border: 2px solid red; background-color: red; 20px; width: 40px; height: 20px;border-radius: 10px; float: left;"></div>
                    <div style="margin-left: 50px;">Roadway with 50,000 or more cars per day.</div>

                    </br></br>

                    <img src="static/img/marker-icon-yellow.png"></img>
                    A school that is within 1000 feet of a 50,000+ cars/day roadway.
                    
                    </br></br>

                    <img src="static/img/marker-icon-blue.png"></img>
                    A school that is <b>not</b> within 1000 feet of a 50,000+ cars/day roadway.

                </p>

                <p class="lead">
                    If you would like to see the code and data for this website, you can head to <a href="https://github.com/hhroc/traffairious">Github.com</a>.  If you would like to learn more about how this site was built, the data that it is using, and Hacks/Hackers Rochester, checkout the <a href="about">about</a> page.
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
