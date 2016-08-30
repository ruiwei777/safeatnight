from django import forms
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Fieldset, ButtonHolder, Submit, MultiWidgetField


class SMSForm(forms.Form):
    receiver_area_code = forms.ChoiceField(required=True, choices=(('+61', '+61'),), label="Area code")
    receiver = forms.IntegerField(required=True, label="Receiver number")

    sender_area_code = forms.ChoiceField(required=True, choices=(('+61', '+61'),), label="Area code")
    sender = forms.IntegerField(required=True, label="Your number")



    date = forms.DateTimeField(required=True, widget=forms.SelectDateWidget, label='Date to send')
    hour = forms.IntegerField(required=True, min_value=0, max_value=23, label="Hour to send")
    minute = forms.IntegerField(required=True, min_value=0, max_value=59, label="Minute to send")
    content = forms.CharField(required=True, label='Message content', widget=forms.Textarea(attrs={
        'placeholder': 'Dear mom, I worked at 7-11 in Brighton last night and should have arrived home now. If you see this message, please call me ASAP.'
    }))

    invitation_code = forms.CharField(required=True, label="Invitation Code")


