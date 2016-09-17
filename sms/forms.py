from django import forms
# from crispy_forms.helper import FormHelper
# from crispy_forms.layout import Layout, Fieldset, ButtonHolder, Submit, MultiWidgetField

from .models import SMS
from datetimewidget.widgets import DateTimeWidget




# class SMSForm(forms.Form):
#     receiver_area_code = forms.ChoiceField(required=True, label="Area code", choices=(("+61","+61"),))
#     receiver = forms.IntegerField(required=True, label="Receiver number")
#
#     sender_area_code = forms.ChoiceField(required=True,choices=(("+61","+61"),) , label="Area code")
#     sender = forms.IntegerField(required=True, label="Your number")
#
#
#
#     date = forms.CharField(required=True, widget=forms.SelectDateWidget, label='Date to send')
#     hour = forms.IntegerField(required=True, min_value=0, max_value=23, label="Hour to send")
#     minute = forms.IntegerField(required=True, min_value=0, max_value=59, label="Minute to send")
#     content = forms.CharField(required=True, label='Message content', widget=forms.Textarea(attrs={
#         'placeholder': 'Dear mom, I worked at 7-11 in Brighton last night and should have arrived home now. If you see this message, please call me ASAP.'
#     }))
#
#     invitation_code = forms.CharField(required=True, label="Invitation Code")



class SMSForm(forms.ModelForm):
    class Meta:
        model = SMS
        fields = '__all__'
        widgets = {
            # Use localization and bootstrap 3
            'scheduled_time': DateTimeWidget(attrs={'id': "id_scheduled_time"}, usel10n=True, bootstrap_version=3),
            'active': forms.HiddenInput(),
            # 'scheduled_time': DateTimeWidget(usel10n=True, bootstrap_version=3)
        }
        labels={
            "receiver_areacode": "Areacode",
            "sender_areacode": "Areacode",
            "cancellation_code": "Cancellation code (Case Sensitive)",
        }

class CancelForm(forms.Form):

    phone_number = forms.IntegerField()
    cancellation_code = forms.CharField(required=True, max_length=5)

