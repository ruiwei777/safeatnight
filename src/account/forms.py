from django import forms

from django.contrib.auth import(
		authenticate,
		get_user_model,
		login,
		logout,
	)
from django.contrib.auth.models import User


class UserLoginForm(forms.Form):
	username = forms.CharField()
	password = forms.CharField(widget=forms.PasswordInput)