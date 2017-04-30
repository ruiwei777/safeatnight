from django.conf.urls import url
from . import views

urlpatterns = [

    url(r'^$', views.safety_info_home, name='safety_info_home'),

]