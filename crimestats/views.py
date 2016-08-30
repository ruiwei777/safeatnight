from django.shortcuts import render

# Create your views here.

def crime_home(request):
    return render(request, "crime_home.html", {"title": "crime stats"})