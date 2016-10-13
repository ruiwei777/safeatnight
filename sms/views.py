from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from .forms import SMSForm, CancelForm
from .models import SMS

import twilio.twiml

import os, binascii

from twilio import TwilioRestException
from twilio.rest import TwilioRestClient

from .tasks import send_message, send_message_immediately

from .utils import encrypt, decrypt

from django_twilio.decorators import twilio_view

# Python libs
# from datetime import datetime, timedelta, date
import datetime


# Create your views here.


def index(request):
    return render(request, "index_2.html", {"title": "Home"})


def about_us(request):
    return render(request, "about_us.html", {"title": "About Us"})


def about_safeatnight(request):
    return render(request, "about_safeatnight.html", {"title": "About"})


def sms_home(request):
    context = {}
    is_sent = None
    is_error = None
    cancel_message = None
    title = "Safety Switch"

    # random_code = binascii.b2a_hex(os.urandom(3)).decode("utf-8")
    # print(random_code)
    cancel_form = CancelForm()

    form = SMSForm(request.POST or None)

    if form.is_valid():

        sms_object = form.save()

        send_message.apply_async([sms_object.id], eta=sms_object.scheduled_time)
        to = sms_object.sender_areacode + str(sms_object.sender_number)
        # Immediately send a copy
        send_message_immediately.delay(to, sms_object.scheduled_time, sms_object.cancellation_code)
        # Encrypt and save
        sms_object.receiver_number = sms_object.receiver_number
        sms_object.sender_number = sms_object.sender_number

        sms_object.save()

        is_sent = "Your message to " + str(
            sms_object.receiver_number) + " has been recorded in server and will be sent at the set time."
        form = SMSForm(None)
        # cancel_form = CancelForm(None)

    elif request.POST.get("cancellation_code"):
        cancel_form = CancelForm(request.POST)
        if cancel_form.is_valid():
            phone_number = cancel_form.cleaned_data.get("phone_number")
            cancellation_code = cancel_form.cleaned_data.get("cancellation_code")
            messages = SMS.objects.all().filter(sender_number=phone_number, cancellation_code=cancellation_code)
            if messages.exists():
                for m in messages:
                    m.active = False
                    m.save()
                cancel_message = "Message of phone number " + str(
                    phone_number) + " with cancellation code " + cancellation_code + " have been cancelled."
            else:
                is_error = "Invalid phone number or cancellation code."
            cancel_form = CancelForm(None)
            form = SMSForm(None)

    else:
        print(form.errors)

    context = {
        "form": form,
        "is_sent": is_sent,
        "is_error": is_error,
        "title": title,
        "cancel_message": cancel_message,
        "cancel_form": cancel_form,
    }

    return render(request, "sms_home.html", context)


@twilio_view
def sms_reply(request):
    from_number = request.POST.get('From', None)
    body = request.POST.get('Body', None)

    message = "Error: Server cannot find a corresponding record."

    if from_number and body:
        from_ = from_number[3:]  # now length is 9, no beginning "0"
        qs = SMS.objects.all().filter(sender_number=from_, cancellation_code=body)
        if qs.exists():
            obj = qs.first()
            obj.is_active = False
            obj.save()
            message = "Your message to " + str(obj.receiver_number) + " has been cancelled."
        else:
            from_ = "0" + from_
            qs = SMS.objects.all().filter(sender_number=from_, cancellation_code=body)
            if qs.exists():
                obj = qs.first()
                obj.is_active = False
                obj.save()
                message = "Your message to " + str(obj.receiver_number) + " has been cancelled."

    resp = twilio.twiml.Response()
    resp.sms(message)

    return HttpResponse(str(resp))

    # return render(request, "sms_home.html", {})
