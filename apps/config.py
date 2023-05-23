import os

class Config(object):

    basedir = os.path.abspath(os.path.dirname(__file__))

    DEBUG = (os.getenv('DEBUG', 'False') == 'True')

    # Assets Management
    ASSETS_ROOT = os.getenv('ASSETS_ROOT', '/static/assets')

    # App Config - the minimal footprint
    SECRET_KEY = os.getenv('SECRET_KEY', 'S#perS3crEt_9999')

    if DEBUG:  # Use testing Application Insights key in debug mode
        APPINSIGHTS_INSTRUMENTATIONKEY = '3b0ae1d8-dc8f-4803-8faa-a53ee9d667bd'
    else:  # Use production Application Insights key in non-debug mode
        APPINSIGHTS_INSTRUMENTATIONKEY = '1eec00af-9938-4154-94b0-f11fd3993ead'