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
        new_user = controller.addUser(username = 'Testuser', email='Testuser@example.com', password= generate_password_hash('password', method='sha256'))
     

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_profile(self):

        # log in the test user
        response = self.app.post('/login', data=dict(
            Username='Testuser',
            Password='password'
        ), follow_redirects=True)

        # check if the end point the expected response 
        response = self.app.post('/recoverpassword',data={
                'password1': 'newpassword',
                'password2': 'newpasswor'
            })
        
        self.assertIn('Un-matched passwords', response.data.decode())

        # check if the end point the expected response 
        response = self.app.post('/recoverpassword',data={
                'password1': 'newpassword',
                'password2': 'newpassword'
            })

        # log out the user
        response = self.app.get('/logout', follow_redirects=True)

        # log in with wrong password 
        response = self.app.post('/login', data=dict(
            Username='Testuser',
            Password='password'
        ), follow_redirects=True)

        # check if the end point the expected response 
        response = self.app.get('/index')
        self.assertNotEqual(response.status_code, 200)

        # log in with the correct 
        response = self.app.post('/login', data=dict(
            Username='Testuser',
            Password='newpassword'
        ), follow_redirects=True)

        # check if the end point the expected response 
        response = self.app.get('/index')
        self.assertEqual(response.status_code, 200)







    


if __name__== "__main__":
    unittest.main()


    