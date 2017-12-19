from flask import Flask
from flask import render_template, make_response
app = Flask(__name__)

@app.route('/hello/')
def hello_world():
	return render_template('hello.html', name="")

@app.route('/hello/<name>')
def hello_name(name):
    return render_template('hello.html', name=name)