from .models import *

class controller:

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


    def insertNotification(title,content,user_id):
        notification = Alerts(title=title, content=content,used_id=user_id)
        db.session.add(notification)
        db.session.commit()
    
    def selectNotifications(user_id):
        
        notifications = Alerts.query.filter_by(user_id=user_id)
        return notifications
    
    def deleteNotification(id):
        Notification = Alerts.query.filter_by(id=id).first()
        db.session.delete(Notification)
        db.session.commit()
    
    def editallNotificationState():
        notifications = Alerts.query.all()
        for i in notifications:
          if i.state != 'done':
            i.state = 'done'
          db.session.commit()


