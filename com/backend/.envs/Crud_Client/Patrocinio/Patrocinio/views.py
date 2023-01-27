from django.http import HttpResponse
from django.template import Context, Template

def proof(request):
    return HttpResponse('huelo')

def probandoTemplate(request):
    
    miHtml = open("/Users/alber/OneDrive/Escritorio/IALAB/Patrocinio/proyecto-patrocinio/com/backend/.envs/Crud_Client/Patrocinio/Patrocinio/Plantillas/template.html")
                    
    plantilla = Template(miHtml.read())
    
    miHtml.close()
    
    miContexto = Context()
    
    documento = plantilla.render(miContexto)
    
    return HttpResponse(documento)

def Cliente(self, idclient, postal, address,marital_status,housing_type,studies_idstudies):
    
    cliente= Cliente(idclient=idclient, postal=postal, address=address,marital_status=marital_status,housing_type=housing_type,studies_idstudies=studies_idstudies)
    cliente.save()
    
    return HttpResponse(f""" <p>ID cliente:{Cliente.idclient} - estado marital: {Cliente.marital_status} """)