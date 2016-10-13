from django.contrib.auth.decorators import login_required

from django.shortcuts import render


# Create your views here.


def crime_home(request, area):
    area = request.GET.get("area") or None;


    context = {
        "title": "Crime Stats",
        "area": area
    }

    return render(request, "crime_home.html", context)


def crime_get(request, area):
    return render(request, "crime_home.html", {"title": "crime stats"})
