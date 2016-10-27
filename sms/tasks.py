from __future__ import absolute_import

from celery import shared_task

from twilio import TwilioRestException
from twilio.rest import TwilioRestClient

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


# @shared_task
# def send_message(to, from_, body):
#     # twilio logic
#     account_sid = "ACb61a1a7533233534787f9238a8c6cbe2"  # Your Account SID from www.twilio.com/console
#     auth_token = "4b56b71e8e9a46560559f96bc86af8f5"  # Your Auth Token from www.twilio.com/console
#
#     client = TwilioRestClient(account_sid, auth_token)
#
#     try:
#         message = client.messages.create(body=body,
#                                          to=to,  # Replace with your phone number
#                                          from_=from_)  # Replace with your Twilio number
#         print("Message has been sent")
#     except TwilioRestException as e:
#         print(e)


@shared_task
def send_message(id):
    sms_object = SMS.objects.get(pk=id)
    body = sms_object.content
    to = sms_object.receiver_areacode + str(sms_object.receiver_number)

    if sms_object.active:
        # twilio logic
        account_sid = "ACb61a1a7533233534787f9238a8c6cbe2"  # Your Account SID from www.twilio.com/console
        auth_token = "4b56b71e8e9a46560559f96bc86af8f5"  # Your Auth Token from www.twilio.com/console

        client = TwilioRestClient(account_sid, auth_token)

        try:
            message = client.messages.create(body=body,
                                             to=to,  # Replace with your phone number
                                             from_="+61437148573")  # Replace with your Twilio number
            sms_object.active = False
            sms_object.save()
            print("Message has been sent.")
        except TwilioRestException as e:
            print(e)
    else:
        print("Message has been cancalled.")


@shared_task
def send_message_immediately(sender_, receiver_, eta, cancellation_code):
    body = "A message to " + str(receiver_) + " scheduled at " + eta.strftime('%d-%m-%Y %H:%M') + " under your phone number has been set. Reply this message " \
                                                                "with cancellation code or go to the website to cancel the message." \
                                                                " Cancellation code: " + cancellation_code + " (www.safeatnight.cf)"


    # twilio logic
    account_sid = "ACb61a1a7533233534787f9238a8c6cbe2"  # Your Account SID from www.twilio.com/console
    auth_token = "4b56b71e8e9a46560559f96bc86af8f5"  # Your Auth Token from www.twilio.com/console

    client = TwilioRestClient(account_sid, auth_token)

    try:
        message = client.messages.create(body=body,
                                         to=sender_,  # Replace with your phone number
                                         from_="+61437148573")  # Replace with your Twilio number
        print("Message has been sent.")
    except TwilioRestException as e:
        print(e)

