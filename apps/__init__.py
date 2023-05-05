# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

import os

# import Flask 
from flask import Flask
from .config import Config
from flask_sqlalchemy import SQLAlchemy
from os import path
from .models import db, Users
from flask_login import LoginManager
from werkzeug.middleware.shared_data import SharedDataMiddleware
from werkzeug.utils import secure_filename
from mimetypes import MimeTypes

# Inject Flask magic
app = Flask(__name__)

mimetypes = MimeTypes()
mimetypes.add_type('application/javascript', '.js')

# load Configuration
app.config.from_object( Config )
app.config['SECRET_KEY'] = 'supersecretkey'  #yara


# Import routing to render the pages
from apps import views

login_manager = LoginManager()
login_manager.login_view = 'login'
login_manager.init_app(app)

@login_manager.user_loader
def load_user(id):
    return Users.query.get(int(id))

DB_NAME = "database.db"
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
db.init_app(app)


def create_database(app):
    if not path.exists('apps/' + DB_NAME):
        with app.app_context():
             db.create_all()

# Now the database is created and linked  
create_database(app)