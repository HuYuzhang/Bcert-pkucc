from flask import Flask,render_template,g,session
from flask_cors import CORS

#app = Flask(__name__,template_folder="templates",static_folder="static",static_url_path="/backend/static")
app = Flask(__name__,template_folder="templates",static_folder="static",static_url_path="")
CORS(app,supports_credentials=True)
#CORS(app,supports_credentials=True,resources={r"/*":{"origins":"https://browser.blockstack.org"}})
from . import main
app.config['SECRET_KEY'] = '...selfgenerated'
app.debug = True
#db.init_app(app)
