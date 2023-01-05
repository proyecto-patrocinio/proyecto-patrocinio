from django.test.client import  RequestFactory
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from locality.api.views import NationalityApiViewSet, ProvinceApiViewSet, LocalityApiViewSet
from rest_framework.test import force_authenticate
from django.urls import reverse 

#auxiliary functions
def load_nationality(self,id,name):
    nationality_data =  {  
                         "id": id, 
                         "name": name ,
                        }
    url= reverse('nationality-list')
    request = self.factory.post(url,nationality_data)
    force_authenticate(request, user=self.user)
    view =  NationalityApiViewSet.as_view({'post': 'create'})
    response =view(request)
    return response

def load_province(self,id,name,nationality):
    province_data =  {  
                         "id": id, 
                         "name": name ,
                         "nationality": nationality,
                        }
    url= reverse('province-list')
    request = self.factory.post(url,province_data)
    force_authenticate(request, user=self.user)
    view =  ProvinceApiViewSet.as_view({'post': 'create'})
    response =view(request)
    return response

def load_locality(self,id,name,province):
    locality_data =  {  
                         "id": id, 
                         "name": name ,
                         "province": province,
                        }
    url= reverse('locality-list')
    request = self.factory.post(url,locality_data)
    force_authenticate(request, user=self.user)
    view =  LocalityApiViewSet.as_view({'post': 'create'})
    response =view(request)
    return response

#master class
class TestSetUp(APITestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.client = APIClient()
        self.user = User.objects.create_superuser(username='admin',email='admin@user.com',password='53cur3_?a55w0rd',is_staff=True)
        self.user.save()
