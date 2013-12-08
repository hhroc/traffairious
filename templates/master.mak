<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>${self.title()}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Traffairious" />
    <meta name="author" content="RemyD" />

    <script src="/static/js/pace.min.js"></script>


    <!-- Le styles -->
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.6.4/leaflet.css" />
    <link href="/static/css/bootstrap.min.css" rel="stylesheet" />
    <link href="/static/css/site.css" rel="stylesheet" />
    <link href="/static/css/pace-theme-bounce.css" rel="stylesheet" />
    <link href="/static/css/pace.css" rel="stylesheet" />

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="static/js/html5shiv.js"></script>
    <![endif]-->

    <!-- Fav and touch icons -->
    <link rel="shortcut icon" href="${url_for('static', filename='img/favicon.png')}">
  </head>

  <body>

    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="navbar-header">
        <a class="navbar-brand" href="/">HOME</a>
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
      </div>
      <div class="navbar-collapse collapse">
        <p class="navbar-text pull-right">
          Fork me on <a target="_blank" href="http://github.com/HHROC/traffairious" class="navbar-link">Github</a>
        </p>
        <ul class="nav navbar-nav">
          <li><a href="/about">About</a></li>
          <li><a href="/story">The Story</a></li>
          <li><a target="_blank" href="http://www.meetup.com/HackshackersROC">HHROC</a></li>
        </ul>
      </div><!--/.nav-collapse -->
    </nav>

    ${self.body()}

    <!-- Le javascript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="/static/js/jquery.js"></script>
    <script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
    <script src="/static/js/bootstrap.min.js"></script>
    <!-- Page-specific scripts -->
    ${self.scripts()}

  </body>
</html>

<%def name="title()">Traffairious</%def>
<%def name="scripts()"></%def>
