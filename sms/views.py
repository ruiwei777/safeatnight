from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from .forms import SMSForm, CancelForm
from .models import SMS

import os, binascii

from twilio import TwilioRestException
from twilio.rest import TwilioRestClient

from .tasks import send_message, send_message_immediately

# Python libs
# from datetime import datetime, timedelta, date
import datetime


# Create your views here.

@login_required()
def index(request):
    return render(request, "index_2.html", {"title": "Home"})


@login_required()
def about_us(request):
    return render(request, "about_us.html", {"title": "About Us"})


@login_required()
def about_safeatnight(request):
    return render(request, "about_safeatnight.html", {"title": "About"})


@login_required()
def sms_home(request):
    context = {}
    is_sent = None
    is_error = None
    cancel_message = None
    receiver = None
    title = "Safety Switch"

    #random_code = binascii.b2a_hex(os.urandom(3)).decode("utf-8")
    #print(random_code)
    cancel_form = CancelForm()

    form = SMSForm(request.POST or None)
    print(request.POST.get("cancellation_code"))
    print(request.POST.get("sender_number"))
    if form.is_valid():

        sms_object = form.save()
        # print(sms_object.id)
        print(sms_object.sender_number)

        send_message.apply_async([sms_object.id], eta=sms_object.scheduled_time)
        to = sms_object.sender_areacode + str(sms_object.sender_number)
        # Immediately send a copy
        send_message_immediately.delay(to, sms_object.scheduled_time, sms_object.cancellation_code)
        is_sent = True
        receiver = sms_object.receiver_number
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
                cancel_message = "Message(s) of phone number " + str(
                    phone_number) + " with cancellation code " + cancellation_code + " have been cancelled."
            else:
                is_error = "Invalid phone number of cancellation code."
            cancel_form = CancelForm(None)
            form = SMSForm(None)

    else:
        print(form.errors)

    context = {
        "form": form,
        "is_sent": is_sent,
        "is_error": is_error,
        "receiver": receiver,
        "title": title,
        "cancel_message": cancel_message,
        "cancel_form": cancel_form,
    }

    return render(request, "sms_home.html", context)
