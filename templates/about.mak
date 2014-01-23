<%inherit file="master.mak"/>

<div class="jumbotron">
<h1>Hello, world!</h1>
<p>This is a wonderful experiment using Twitter Boostrap, Flask, and Mako to make awesome.</p>
<p><a href="#" class="btn btn-primary btn-lg">Github Repo&raquo;</a></p>
</div>

<div class="row">
<div class="col-md-4">
  <h2>Twitter Bootstrap</h2>
  <p><em>"Sleek, intuitive, and powerful mobile first front-end framework for faster and easier web development."</em></p>
  <p><a target="_blank" class="btn btn-default" href="http://getbootstrap.com/">View details &raquo;</a></p>
</div><!--/span-->
<div class="col-md-4">
  <h2>Flask</h2>
  <p><em>"Flask is a microframework for Python based on Werkzeug, Jinja 2 and good intentions."</em></p>
  <p><a class="btn btn-default" target="_blank" href="http://flask.pocoo.org/">View details &raquo;</a></p>
</div><!--/span-->
<div class="col-md-4">
  <h2>Mako</h2>
  <p><em>"Mako is used by the python.org website, as well as reddit.com where it
  delivers over one billion page views per month. It is the default template
  language included with the Pylons and Pyramid web frameworks."</em></p>
  <p><a class="btn btn-default" target="_blank" href="http://www.makotemplates.org/">View details &raquo;</a></p>
</div><!--/span-->
</div><!--/row-->

<%def name="scripts()">
    <script src="/static/js/active-nav.js"></script>
</%def>