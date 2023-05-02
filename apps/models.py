from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from dataclasses import dataclass
import datetime

db = SQLAlchemy()

class Users(db.Model, UserMixin):

    __tablename__ = 'Users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True)
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.String(150))

@dataclass
class UserWatchList(db.Model):
    item : str

    id = db.Column(db.Integer, primary_key=True)
    item = db.Column(db.String, nullable=False)
    user_id = db.Column(db.ForeignKey(Users.id, ondelete='CASCADE'),
                        nullable=False)


class Alerts(db.Model):
    __tablename__ = 'Alerts'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    state = db.Column(db.String(10),nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)