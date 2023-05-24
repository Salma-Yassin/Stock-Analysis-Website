from apps import app
import unittest
from apps.models import db 
from datetime import datetime
from apps.models import *
from apps.controller import controller
from werkzeug.security import generate_password_hash
import datetime

class TimezoneTestCase(unittest.TestCase):
    def setUp(self):
        # Set up a test client and test database
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
        # Clean up the test database
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_get_time(self):
        # Test getting the time, date, and day for a user
        
            # Log in as a test user
            response = self.app.post('/login', data=dict(
                Username='Testuser',
                Password='password'
            ), follow_redirects=True)
            

            # Set a new time, date, and day for the user
            self.app.post('/set-time', data=dict(
                time='12:30',
                date='2023-05-25',
                day='Wednesday'
            ), follow_redirects=True)

            # Get the time, date, and day for the user
            response = self.app.get('/get_time')

            # Check that the response is successful
            self.assertEqual(response.status_code, 200)

            # Check that the response contains the correct data
            data = response.get_json()
            self.assertIsNotNone(data['time'])
            self.assertIsNotNone(data['date'])
            self.assertEqual(data['day'], 'Wednesday')
            
if __name__== "__main__":
    unittest.main()