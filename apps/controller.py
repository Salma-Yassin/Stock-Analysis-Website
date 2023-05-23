from .models import *

class controller:

    def addUser(username, email, password):
        new_user = Users(username = username ,email=email, password= password) 
        db.session.add(new_user)
        db.session.commit()
        return new_user

    def editUser(id, email='', password='', name=''):
        user = Users.query.filter_by(id=id).first()
        if email != '':
            user.email = email
        if password != '':
            user.password = password
        if name != '':
            user.username = name
        db.session.commit()

    def deleteUser(id):
        user = Users.query.filter_by(id=id).first()
        db.session.delete(user)
        db.session.commit()
    
    def addUserWatchList(item, user_id):
        newUserWatchList = UserWatchList(item=item, user_id=user_id)
        db.session.add(newUserWatchList)
        db.session.commit()


    def deleteUserWatchListitem(id):
        watchlistItem = UserWatchList.query.filter_by(id=id).first()
        db.session.delete(watchlistItem)
        db.session.commit()
    

    def insertNotification(title,content,user_id):
        notification = Alerts(title = title ,content = content ,state='not done' ,user_id= user_id)
        db.session.add(notification)
        db.session.commit()
        return notification
    
    def deleteNotification(id):
        Notification = Alerts.query.filter_by(id=id).first()
        db.session.delete(Notification)
        db.session.commit()
    
    def editallNotificationState(user_id):
        notifications = Alerts.query.filter_by(user_id=user_id).all()
        for notification in notifications:
            notification.state = 'done'
            db.session.commit()



