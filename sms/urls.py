from django.conf.urls import url
from . import views

urlpatterns = [


    url(r'^$', views.sms_home, name='sms_home'),

]
