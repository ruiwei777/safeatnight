
from django.contrib.auth.decorators import login_required

from django.shortcuts import render


# Create your views here.

@login_required()
def crime_home(request):
    return render(request, "crime_home.html", {"title": "crime stats"})