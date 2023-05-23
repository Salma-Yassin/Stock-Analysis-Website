from apps import app
import unittest
from apps.models import db 
from apps.models import *
from apps.controller import controller
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
        new_user = controller.addUser(username = 'Testuser', email='Testuser@example.com', password= generate_password_hash('password', method='sha256'))

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_index(self):

        ########### UnSuccessful Log in ###########
        # log in the test user
        response = self.app.post('/login', data=dict(
            Username='Testuser',
            Password='wrongpassword'
        ), follow_redirects=True)

        # follow the redirect to the protected route
        response = self.app.get('/index')

        # check that the status code is 200
        statuscode = response.status_code
        self.assertNotEqual(statuscode,200)

        ########### Successful Log in ###########
        # log in the test user
        response = self.app.post('/login', data=dict(
            Username='Testuser',
            Password='password'
        ), follow_redirects=True)

        # follow the redirect to the protected route
        response = self.app.get('/index')

        # check that the status code is 200
        statuscode = response.status_code
        self.assertEqual(statuscode,200)

if __name__== "__main__":
    unittest.main()
