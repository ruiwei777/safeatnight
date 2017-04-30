from __future__ import absolute_import

from celery import shared_task

from twilio import TwilioRestException
from twilio.rest import TwilioRestClient

from django.conf import settings
from .models import SMS


@shared_task
def add(x, y):
    return x + y


@shared_task
def mul(x, y):
    return x * y


@shared_task
def xsum(numbers):
    return sum(numbers)


@shared_task
def send_message(id):
    sms_object = SMS.objects.get(pk=id)
    body = sms_object.content
    to = sms_object.receiver_areacode + str(sms_object.receiver_number)

    if sms_object.active:
        # twilio logic
        account_sid = settings.TWILIO_ACCOUNT_SID
        auth_token = settings.TWILIO_AUTH_TOKEN

        client = TwilioRestClient(account_sid, auth_token)

        try:
            message = client.messages.create(body=body,
                                             to=to,
                                             from_="+61437148573")
            sms_object.active = False
            sms_object.save()
            print("Message has been sent.")
        except TwilioRestException as e:
            print(e)
    else:
        print("Message has been cancalled.")


@shared_task
def send_message_immediately(sender_, receiver_, eta, cancellation_code):
    body = "A message to " + str(receiver_) \
           + " scheduled at " \
           + eta.strftime('%d-%m-%Y %H:%M') \
           + " under your phone number has been set. Reply this message " \
            "with cancellation code or go to the website to cancel the message." \
            " Cancellation code: " + cancellation_code + " (www.safeatnight.cf)"


    # twilio logic
    account_sid = settings.TWILIO_ACCOUNT_SID
    auth_token = settings.TWILIO_AUTH_TOKEN

    client = TwilioRestClient(account_sid, auth_token)

    try:
        message = client.messages.create(body=body,
                                         to=sender_,
                                         from_="+61437148573")
        print("Message has been sent.")
    except TwilioRestException as e:
        print(e)

