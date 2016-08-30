from django.conf.urls import url
from . import views

urlpatterns = [


    url(r'^$', views.crime_home, name='crime_home'),

]