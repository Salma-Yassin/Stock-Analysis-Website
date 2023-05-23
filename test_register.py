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
        old_user = controller.addUser(username = 'Olduser', email='Olduser@example.com', password= generate_password_hash('password', method='sha256'))

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_register(self):
    
        ########### UnSuccessful  Register ###########

        # Case 1: (Existed username)
        # send a POST request with test data
        response = self.app.post('/register', data=dict(
        username='Olduser',
        email='testuser2@example.com',
        password='password'
        ), follow_redirects=True)
        
        self.assertIn('Username already registered', response.data.decode()) 

        # follow the redirect to the protected route
        response = self.app.get('/index')

        # check if the response is successful
        statuscode = response.status_code
        self.assertNotEqual(statuscode, 200) 

        # Check email exists
        user = Users.query.filter_by(email='testuser2@example').first()
        self.assertIsNone(user) 
        
        # Case 2: (Existed email)
        # send a POST request with test data
        response = self.app.post('/register', data=dict(
        username='testuser2',
        email='Olduser@example.com',
        password='password'
        ), follow_redirects=True)
        
        self.assertIn('Email already registered', response.data.decode()) 

        # follow the redirect to the protected route
        response = self.app.get('/index')

        # check if the response is successful
        statuscode = response.status_code
        self.assertNotEqual(statuscode, 200) 

        # Check email exists
        user = Users.query.filter_by(username='testuser2').first()
        self.assertIsNone(user) 



        # Case 3: (Empty username)
        # send a POST request with test data
        response = self.app.post('/register', data=dict(
        username='',
        email='testuser2@example.com',
        password='password'
        ), follow_redirects=True)
        
        self.assertIn('Username field can not be empty', response.data.decode()) 

        # follow the redirect to the protected route
        response = self.app.get('/index')

        # check if the response is successful
        statuscode = response.status_code
        self.assertNotEqual(statuscode, 200)  

        # Check email exists
        user = Users.query.filter_by(username='testuser2').first()
        self.assertIsNone(user)
        

        # Case 4: (Invalid email)
        # send a POST request with test data
        response = self.app.post('/register', data=dict(
        username='testuser2',
        email='testuser2@example',
        password='password'
        ), follow_redirects=True)
        
        self.assertIn('Not a Valid Email', response.data.decode()) 

        # follow the redirect to the protected route
        response = self.app.get('/index')

        # check if the response is successful
        statuscode = response.status_code
        self.assertNotEqual(statuscode, 200)  

        # Check email exists
        user = Users.query.filter_by(username='testuser2').first()
        self.assertIsNone(user)

        # Case 5: (Empty email)
        # send a POST request with test data
        response = self.app.post('/register', data=dict(
        username='testuser2',
        email='',
        password='password'
        ), follow_redirects=True)
        
        self.assertIn('Email field can not be empty', response.data.decode()) 

        # follow the redirect to the protected route
        response = self.app.get('/index')

        # check if the response is successful
        statuscode = response.status_code
        self.assertNotEqual(statuscode, 200)  

        # Check email exists
        user = Users.query.filter_by(username='testuser2').first()
        self.assertIsNone(user)


        #self.assertIn(b'Login', response.data)
        
        
        ########### Successful  Register ###########
        # send a POST request with test data
        response = self.app.post('/register', data=dict(
        username='testuser2',
        email='testuser2@example.com',
        password='password'
        ), follow_redirects=True)
        

        # follow the redirect to the protected route
        response = self.app.get('/index')

        # check if the response is successful
        statuscode = response.status_code
        self.assertEqual(statuscode, 200)  

        # Check email exists
        user = Users.query.filter_by(username='testuser2').first()
        self.assertEqual(user.username, 'testuser2')


if __name__== "__main__":
    unittest.main()