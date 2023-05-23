from apps import app
import unittest
from apps.models import db 
from apps.models import *

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

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_register(self):
    # send a POST request with test data
        response = self.app.post('/register', data=dict(
        username='testuser2',
        email='testuser2@example.com',
        password='password'
    ), follow_redirects=True)

    # check if the response is successful
        statuscode = response.status_code
        self.assertEqual(statuscode, 200)   


if __name__== "__main__":
    unittest.main()