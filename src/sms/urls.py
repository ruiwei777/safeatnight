from django.conf.urls import url
from . import views

urlpatterns = [

    url(r'^reply/$', views.sms_reply, name='sms_reply'),
    url(r'^$', views.sms_home, name='sms_home'),

]
