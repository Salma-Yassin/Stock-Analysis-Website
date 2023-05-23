from apps import app
import unittest
from apps.models import db 
from apps.models import *
from apps.controller import controller
import json
from werkzeug.security import generate_password_hash

class FlaskTest(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        app.config['DEBUG'] = False
        app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///test.db'

        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()

        with app.app_context():
            db.create_all()

        # create a test user
        new_user = controller.addUser(username = 'testuser', email='testuser@example.com', password= generate_password_hash('password', method='sha256'))
     

    def tearDown(self):
        # delete the test stock from the user's watchlist
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_add_to_watchlist(self):
        # log in the test user
        response = self.app.post('/login', data=dict(
            Username='testuser',
            Password='password'
        ), follow_redirects=True)


        item = {
            "NFLX": {
                "financialData": {
                    "currentPrice": {"fmt": "109.57", "raw": 98.40809183525215},
                    "maxAge": 86400,
                    "recommendationKey": "buy",
                    "recommendationMean": {"fmt": "2.02", "raw": 2.1062750042209073},
                    "targetHighPrice": {"fmt": "151.75", "raw": 152.3262956235114},
                    "targetLowPrice": {"fmt": "44.52", "raw": 56.052017934351085},
                    "targetMeanPrice": {"fmt": "98.71", "raw": 104.62383108235767},
                    "targetMedianPrice": {"fmt": "97.44", "raw": 106.60936036296079}
                }
            }
        }

        response = self.app.post('/add_to_watchlist', json=item, follow_redirects=True)

        # check that the status code is 200
        statuscode = response.status_code
        self.assertEqual(statuscode,200)

        # check that a corresponding UserWatchList object was created in the database
        user = Users.query.filter_by(username='testuser').first()
        user_watchlist = UserWatchList.query.filter_by(user_id= user.id).first()
        self.assertIsNotNone(user_watchlist)

        

if __name__== "__main__":
    unittest.main()
