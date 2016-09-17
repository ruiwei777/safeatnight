from django.shortcuts import render

from django.contrib.auth.decorators import login_required

# Create your views here.


@login_required()
def safety_info_home(request):



    context={
        "title": "Safety Tips",

    }

    return render(request, "safety_info_home.html", context)
