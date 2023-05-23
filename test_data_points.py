import unittest
import json
from apps import app
from apps.models import db 
from apps.models import *


class FlaskTest(unittest.TestCase):

    # Setup method that runs before each test
    def setUp(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        app.config['DEBUG'] = False

        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_get_notification_count(self):
        response = self.app.get('/get_notification_count')
        self.assertEqual(response.status_code, 200)

   