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

        # create a test user
        user = Users(username='testuser', email='testuser@example.com', password='password')
        db.session.add(user)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_index(self):
        # log in the test user
        response = self.app.post('/login', data=dict(
            Username='testuser',
            Password='password'
        ), follow_redirects=True)

        # follow the redirect to the protected route
        response = self.app.get('/fo', follow_redirects=True)

        # check that the status code is 200
        statuscode = response.status_code
        self.assertEqual(statuscode,200)

if __name__== "__main__":
    unittest.main()
