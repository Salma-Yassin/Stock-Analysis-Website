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
        self.notification1 = controller.insertNotification(title='1 Notification',content='Welcome to the website',user_id= new_user.id)
        self.notification2 = controller.insertNotification(title='2 Notification',content='Welcome to the website',user_id= new_user.id)
     

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_notifications(self):

        # log in the test user
        response = self.app.post('/login', data=dict(
            Username='Testuser',
            Password='password'
        ), follow_redirects=True)


        # check if the end point the expected response 
        response = self.app.get('/get_notification_count')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, 2)

        # Test /Notification route 
        response = self.app.get('/Notfications')
        self.assertEqual(response.status_code, 200)
        self.assertIn('1 Notification', response.data.decode())
        self.assertIn('2 Notification', response.data.decode())


        # Test /delete_notification
        response = self.app.post('/delete_notification', json = str(self.notification1.id), follow_redirects=True)
        self.assertEqual(response.status_code, 200)

        
        response = self.app.get('/Notfications')
        self.assertEqual(response.status_code, 200)
        self.assertNotIn('1 Notification', response.data.decode())
        self.assertIn('2 Notification', response.data.decode())



if __name__== "__main__":
    unittest.main()


    