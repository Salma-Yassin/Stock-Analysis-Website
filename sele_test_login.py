import unittest
from selenium.webdriver.common.by import By
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from apps import app
from apps.controller import *
from werkzeug.security import generate_password_hash

class TestIndex(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get('http://localhost:5000/login')
        # create a test user
        with app.app_context():
            new_user = controller.addUser(username = 'testuser_in' ,email='testuser_in@example.com', password= generate_password_hash('password', method='sha256'))

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()
        self.driver.quit()

    def test_index(self):

        ######## UnSuccessful LOGIN ##########
        # Case 1: wrong username
        
        # Wait for the email field to be present
        wait = WebDriverWait(self.driver, 20)
        name_field = wait.until(EC.presence_of_element_located((By.NAME, 'Username')))

        # Enter user information into registration form
        name_field.send_keys('testuser_in2')
        self.driver.find_element(By.NAME, 'Password').send_keys('password')
        self.driver.find_element(By.NAME, 'login').click()

        # Check that the registration was unsuccessful
        self.assertNotEqual(self.driver.current_url, 'http://localhost:5000/main-dashboard.html')



        # Case 2: wrong password
        
        # Wait for the email field to be present
        wait = WebDriverWait(self.driver, 20)
        name_field = wait.until(EC.presence_of_element_located((By.NAME, 'Username')))

        # Enter user information into registration form
        name_field.send_keys('testuser_in2')
        self.driver.find_element(By.NAME, 'Password').send_keys('wrong password')
        self.driver.find_element(By.NAME, 'login').click()

        # Check that the registration was unsuccessful
        self.assertNotEqual(self.driver.current_url, 'http://localhost:5000/main-dashboard.html')

        
        ######## Successful LOGIN ##########
        
        # Case 3: Loged in
        # Wait for the email field to be present
        wait = WebDriverWait(self.driver, 20)
        name_field = wait.until(EC.presence_of_element_located((By.NAME, 'Username')))

        # Enter user information into registration form
        name_field.send_keys('testuser_in')
        self.driver.find_element(By.NAME, 'Password').send_keys('password')
        self.driver.find_element(By.NAME, 'login').click()

        # Check that the registration was successful
        self.assertEqual(self.driver.current_url, 'http://localhost:5000/main-dashboard.html')


