"""
ASGI config for IoT_Mini_Project_Group_H project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'IoT_Mini_Project_Group_H.settings')

application = get_asgi_application()
