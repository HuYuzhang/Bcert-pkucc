from flask import Flask
from flask_cors import CORS

app = Flask(__name__,template_folder="templates",static_folder="static",static_url_path="")
CORS(app,supports_credentials=True)
app.config['SECRET_KEY'] = '...selfgenerated'
app.debug = True

import main

if __name__ == "__main__":
    app.run(host='127.0.0.1', port=3000)