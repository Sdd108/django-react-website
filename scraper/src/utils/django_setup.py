import os
import sys
import django

def setup_django():
    sys.path.append(os.path.join(os.path.dirname(os.path.dirname(
        os.path.dirname(os.path.dirname(__file__)))), 'backend'))
    os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'
    django.setup() 