# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

# Flask modules
from flask   import Flask, render_template, request, flash, redirect, url_for, jsonify
import json
from jinja2  import TemplateNotFound
from .models import *
from flask_login import login_user, login_required, current_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_wtf import FlaskForm
from wtforms import FileField, SubmitField
from werkzeug.utils import secure_filename
import os
from wtforms.validators import InputRequired
from .models import db 
from random import sample 

import sys
from .controller import controller

# App modules
from apps import app
import random
from datetime import datetime, timedelta
from .generate_stock_data import generate_stock_data

import requests

@app.route('/')
def route_default():
    return redirect(url_for('login'))

# Login & Registration

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # read form data
        username = request.form.get('Username')
        password = request.form.get('Password')
        
        # Locate user
        user = Users.query.filter_by(username=username).first()
        if user:
            if check_password_hash(user.password, password):
                login_user(user, remember=True)
                return redirect(url_for('route_default'))
            else:
                return render_template('accounts/login.html',
                               msg='Wrong password')
        else:
            return render_template('accounts/login.html',
                               msg=' User not found or wrong user')

    if not current_user.is_authenticated:
        return render_template('accounts/login.html')
    return redirect(url_for('index'))
    
@app.route('/register', methods=['GET', 'POST'])
def register():

    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')

        # Check usename exists
        user = Users.query.filter_by(username=username).first()

        if user:
            return render_template('accounts/register.html',
                                   msg='Username already registered',
                                   success=False)
        # Check email exists
        user = Users.query.filter_by(email=email).first()
        if user:
            return render_template('accounts/register.html',
                                   msg='Email already registered',
                                   success=False)


        new_user = Users(username = username ,email=email, password= generate_password_hash(password, method='sha256')) 
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user, remember=True)

        # creating notifications for first time log in 
        user_id = current_user.id
        new_notification = Alerts(title='First Notification',content='Welcome to the website',state='not done',user_id= user_id)
        db.session.add(new_notification)
        db.session.commit()


        return redirect(url_for('route_default'))
    
    return render_template('accounts/register.html')
       
@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('login'))

## profile Settings 

# Recover Password
@app.route('/recoverpassword', methods=['GET', 'POST'])
def recoverpassword():
    if request.method == 'POST':
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')
        if password1 != password2:
            return render_template('home/examples-recover-password.html', msg ='Un-matched passwords')
        user_id = current_user.id
        controller.editUser(id=user_id,password=generate_password_hash(password1, method='sha256'))
        return redirect(url_for('index'))
    else:
        return render_template('home/examples-recover-password.html')
    

# Editing Profile
@app.route('/editingprofile', methods=['GET', 'POST'])
def editingprofile():
    if request.method == 'POST':

        user_id = current_user.id

        if request.form.get('edit_account'):
            username = request.form.get('username_edit')
            email = request.form.get('email_edit')

        
            controller.editUser(id=user_id, name=username, email=email)
            return redirect(url_for('index'))
        
        elif request.form.get('delete_account'):
            password = request.form.get('delete_password')

            if check_password_hash(current_user.password, password):
                controller.deleteUser(id=user_id)
                logout_user()
                return redirect(url_for('login', msg='Account Deleted'))

            else:
                return render_template('home/edit-profile.html', user=current_user, msg='Wrong password')
            
    else:
        return render_template('home/edit-profile.html', user=current_user)
    


# @app.route('/main-dashboard.html')
# @login_required
# def index():
#     return render_template('home/main-dashboard.html', segment='index')


@app.route('/<template>')
@login_required
def route_template(template):

    try:

        if not template.endswith('.html'):
            template += '.html'

        # Detect the current page
        segment = get_segment(request)

        # Serve the file (if exists) from app/templates/home/FILE.html
        return render_template("home/" + template, segment=segment)

    except TemplateNotFound:
        return render_template('home/page-404.html'), 404

    except:
        return render_template('home/page-500.html'), 500

# Helper - Extract current page name from request
def get_segment(request):

    try:

        segment = request.path.split('/')[-1]

        if segment == '':
            segment = 'index'

        return segment

    except:
        return None




# Get Notifications
@app.route('/Notfications', methods=['GET', 'POST'])
def getNotfication():
    if request.method == 'GET':
        user_id = current_user.id
        notifications = Alerts.query.filter_by(user_id=user_id).all()
        for notification in notifications:
            notification.state = 'done'
            db.session.commit()
        return render_template('home/Notfications.html', values=Alerts.query.filter_by(user_id=user_id),notification_count=0)
    

@app.route('/get_notification_count')
def get_notoification_count():
    user_id = current_user.id
    notifications = Alerts.query.filter_by(user_id=user_id).all()
    notification_count = 0
    for i in notifications:
        print(i.state)
        if i.state != 'done':
            notification_count += 1
    print(notification_count)
    return jsonify(notification_count)
    

@app.route('/index')
@app.route('/main-dashboard.html')
@login_required
def index():
    stock_data = generate_stock_data()
    with open("apps\dataMazen.json", "w") as f:
        json.dump(stock_data, f)
    return render_template('home/main-dashboard.html', segment='index')


#----------- APIs---------#
@app.route('/main-dashboard-news-data')
def get_news_data():

    news_data = {}
    symbols = ['AAPL', 'AMZN', 'TSLA']
    apikey = "8X74CQALL5BWTHJE"

    for symbol in symbols:
        url = f"https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers={symbol}&apikey={apikey}"
        r = requests.get(url)
        
        if r.status_code == 200: # Check if the request was successful
            news_data[symbol] = r.json()['feed'][0] # Add the response data to the dictionary
        else:
            print(f"Failed to get data for {symbol}") # Handle the error case

    # Return the dictionary as JSON
    return json.dumps(news_data)

@app.route('/main-dashboard-data')
def get_stock_data():
    symbols = ['AAPL', 'AMZN', 'GOOGL', 'MSFT', 'TSLA', 'V', 'NFLX', 'DIS', 'NVDA', 'AMD', 'BA', 'GE', 'IBM', 'INTC', 'KO', 'PFE', 'XOM', 'CVX', 'T', 'VZ'] # List of symbols
    headers = {
        "content-type": "application/octet-stream",
        "X-RapidAPI-Key": "c91a4b454emsh049aaf0bec003eep18bdf2jsn131c8d0ac347",
        "X-RapidAPI-Host": "yahoo-finance15.p.rapidapi.com"
    }
    data = {} # Empty dictionary to store data for all symbols

    for symbol in symbols:
        url = f"https://yahoo-finance15.p.rapidapi.com/api/yahoo/qu/quote/{symbol}/financial-data"
        response = requests.get(url, headers=headers)
        print(response.status_code)
        if response.status_code == 200: # Check if the request was successful
            data[symbol] = response.json() # Add the response data to the dictionary
        else:
            print(f"Failed to get data for {symbol}") # Handle the error case

    # Return the dictionary as JSON
    return json.dumps(data)

@app.route('/data') # this is a dummy api that should be removed 
def get_chart_data():
   # generating random data for testing 
   f = open("apps\dataMazen.json")
   return json.load(f)
   

@app.route('/add_to_watchlist', methods=['GET', 'POST']) # this is a dummy api that should be removed 
def add_to_watchlist():
   if request.method == 'GET':
    f = open("apps\dataMazen.json")
    all_data = json.load(f) #updated data 

    watchList = UserWatchList.query.filter_by(user_id=current_user.id)
    item = {}
    for watchListItem in watchList:
        
        financialData = json.loads(watchListItem.item)
        symbol = list(financialData.keys())[0] 

        new_item = all_data[symbol]
        print(new_item == financialData[symbol])
        if new_item != financialData[symbol]:
            item[symbol] = new_item
            # update datebase 

            # generate notification 
            title = symbol + ' has changed'
            content = 'The value for'+symbol+'has changed, you may want o check your watchlist for more details'
            new_notification = Alerts(title = title ,content = content ,state='not done',user_id= current_user.id)
            db.session.add(new_notification)
            db.session.commit()


        else:
             item[symbol] = financialData[symbol]

    return item
  
   elif request.method == 'POST':
    data = request.get_json()
    print(json.dumps(data))

    controller.addUserWatchList(item =json.dumps(data) , user_id=current_user.id)
    # redirect(url_for('login'))
    # render_template('home/page-500.html')
    # with open("apps/User_watchlist.json", "w") as f:
    #   json.dump(data, f)
    return jsonify({'status': 'success'})
  



