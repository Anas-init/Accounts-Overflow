from django.shortcuts import render , HttpResponse


# Create your views here.
def intro(request):
    return HttpResponse("Hello, world!")