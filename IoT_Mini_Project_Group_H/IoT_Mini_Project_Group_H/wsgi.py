"""
WSGI config for IoT_Mini_Project_Group_H project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'IoT_Mini_Project_Group_H.settings')

application = get_wsgi_application()
