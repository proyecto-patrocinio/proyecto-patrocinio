from django.shortcuts import render
from django.http import HttpResponse
from Clients.models import *
from django.template import Template, Context
# Create your views here.


def proof(request):
    
    return HttpResponse('Buenassss')

def pocket(self):
    
    # miHtml = open("C:/Users/alber/OneDrive/Escritorio/IALAB/Patrocinio/proyecto-patrocinio/com/backend/app/Clients/templates/template.html")
                  
    # plantilla = Template(miHtml.read())
    
    # miHtml.close()
    
    # miContexto = Context({"my_name": "Alberto"})
    
    # documento = plantilla.render(miContexto)
    
    #return HttpResponse(documento) 
    return render(self, "index.html")
