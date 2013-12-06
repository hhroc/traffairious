"""
Author: Remy D <remyd@civx.us>
        Ralph Bean <rbean@redhat.com>
License: Apache 2.0
"""
import os

from flask import Flask
from flask.ext.mako import MakoTemplates, render_template
from flask.ext.compress import Compress
from flask import redirect, url_for

app = Flask(__name__)
app.template_folder = "templates"
mako = MakoTemplates(app)
Compress(app)

base_dir = os.path.split(__file__)[0]
with open(os.path.join(base_dir, 'api_key')) as key_file:
    api_key = key_file.read()


@app.route('/')
def index():
    return render_template('index.mak', name='mako', api_key=api_key)


@app.route('/about')
def about():
    return render_template('about.mak', name='mako')


@app.route('/story')
def story():
    return render_template('story.mak', name='mako')
    #return redirect(url_for('static', filename='img/preso.svg'))


@app.route('/slides')
def slides():
    return redirect(url_for('static', filename='img/preso.svg'))


if __name__ == "__main__":
    if 'OPENSHIFT_PYTHON_IP' in os.environ:
        host = os.environ['OPENSHIFT_PYTHON_IP']
        port = int(os.environ['OPENSHIFT_PYTHON_PORT'])
        app.run(host=host, port=port)
    else:
        app.debug = True
        app.run()
