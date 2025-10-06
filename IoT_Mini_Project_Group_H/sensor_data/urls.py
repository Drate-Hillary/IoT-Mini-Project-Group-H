from django.urls import path
from .views import index, sensor_data_api

urlpatterns = [
    path('', index, name='index'),
    path('api/sensor-data/', sensor_data_api, name='sensor_data_api')
]