from django.shortcuts import render

# Create your views here.

def map_home(request):
    context={}

    return render(request,"map_home.html", context)