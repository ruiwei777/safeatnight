from django.contrib import messages
from django.contrib.auth import (
    authenticate,
    get_user_model,
    login,
    logout,
)
from django.core.urlresolvers import reverse
from django.forms import ValidationError
from django.http import HttpResponseRedirect
from django.shortcuts import render

from .forms import UserLoginForm


# Create your views here.

def login_view(request):
    title = "Login"
    form = UserLoginForm(request.POST or None)
    if form.is_valid():
        username = form.cleaned_data.get("username")
        password = form.cleaned_data.get("password")
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                url = request.GET.get("next")
                if url:
                    return HttpResponseRedirect(url)
                else:
                    return HttpResponseRedirect(reverse("index"))
            else:
                pass
        else:
            pass

    context = {
        "form": form,
        "title": title,
    }
    return render(request, "login.html", context)
