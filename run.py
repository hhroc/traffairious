"""
Author: Remy D <remyd@civx.us>
        Ralph Bean <rbean@redhat.com>
License: Apache 2.0
"""
import os

from flask import Flask
from flask.ext.mako import MakoTemplates, render_template

app = Flask(__name__)
app.template_folder = "templates"
mako = MakoTemplates(app)

@app.route('/')
def index():
    return render_template('index-private.html', name='mako')


@app.route('/about')
def about():
    return render_template('about.mak', name='mako')



if __name__ == "__main__":
    if 'OPENSHIFT_PYTHON_IP' in os.environ:
        host = os.environ['OPENSHIFT_PYTHON_IP']
        port = int(os.environ['OPENSHIFT_PYTHON_PORT'])
        app.run(host=host, port=port)
    else:
        app.debug = True
        app.run()
