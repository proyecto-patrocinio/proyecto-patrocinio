from django.shortcuts import render
from django.http import HttpResponse
from django.template import Context, Template

# Create your views here.
def proof(request):
    return HttpResponse('huelo')