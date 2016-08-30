from django.shortcuts import render
from .forms import SMSForm

from twilio import TwilioRestException
from twilio.rest import TwilioRestClient


# Create your views here.

def index(request):
    return render(request, "index.html", {"title": "home"})

def about_us(request):
    return render(request, "about_us.html", {"title": "about us"})

def about_safeatnight(request):
    return render(request, "about_safeatnight.html", {"title": "about safe@night"})


def sms_home(request):
    context = {}
    is_sent = None
    is_error = None
    receiver = None
    title = "safety switch"

    form = SMSForm(request.POST or None)
    if form.is_valid():
        if form.cleaned_data["invitation_code"].lower() != "fit5120":
            is_error="Invalid invitation code"
            context = {
                "form": form,
                "is_sent": is_sent,
                "is_error": is_error,
                "receiver": receiver,
                "title": title,
            }
            return render(request, "sms_home.html", context)

        receiver = form.cleaned_data.get("receiver")
        sender = form.cleaned_data.get("sender")
        date = form.cleaned_data.get("date")
        content = form.cleaned_data.get("content")


        # twilio logic
        account_sid = "ACb61a1a7533233534787f9238a8c6cbe2"  # Your Account SID from www.twilio.com/console
        auth_token = "4b56b71e8e9a46560559f96bc86af8f5"  # Your Auth Token from www.twilio.com/console

        client = TwilioRestClient(account_sid, auth_token)

        try:
            message = client.messages.create(body= content + " (from safeatnight.cf; sender: " + str(sender) +  ") ",
                                             to="+61" + str(receiver),  # Replace with your phone number
                                             from_="+61437148573")  # Replace with your Twilio number
            is_sent = True
        except TwilioRestException as e:
            print(e)
            is_error = str(e)

    context={
        "form": form,
        "is_sent": is_sent,
        "is_error": is_error,
        "receiver": receiver,
        "title": title,
    }

    return render(request, "sms_home.html", context)
