from django.test.client import  RequestFactory
from rest_framework.test import APITestCase, APIRequestFactory  
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from Clients.api.viewsets import *
from rest_framework.test import force_authenticate
from django.urls import reverse 
from locality.api.views import NationalityApiViewSet, ProvinceApiViewSet, LocalityApiViewSet

#auxiliary functions
def load_clients(self,id,postal,address,marital_status,housing_type,studies,locality,email,id_type,id_number,first_name,last_name,birth_date,sex):
    client_data =  {  
                         "id": id, "postal": postal,"address": address,
                             "marital_status":marital_status,
                             "housing_type":housing_type,"studies" :studies, "locality":locality,"email" :email,"id_type": id_type,"id_number" : id_number,
                             "first_name" : first_name,"last_name" : last_name,"birth_date" : birth_date,"sex" : sex
                        }
    url= reverse('client-list')
    request = self.factory.post(url,client_data)
    force_authenticate(request, user=self.user)
    view =  ClientViewSet.as_view({'post': 'create'})
    response =view(request)
    return response

# # def load_nationality(self,id,name):
# #     nationality_data =  {  
# #                          "id": id, 
# #                          "name": name ,
# #                         }
# #     url= reverse('nationality-list')
# #     request = self.factory.post(url,nationality_data)
# #     force_authenticate(request, user=self.user)
# #     view =  NationalityApiViewSet.as_view({'post': 'create'})
# #     response =view(request)
# #     return response
# def load_nationality(self,id,name):
#     nationality_data =  {  
#                          "id": id, 
#                          "name": name ,
#                         }
#     url= reverse('nationality-list')
#     request = self.factory.post(url,nationality_data)
#     force_authenticate(request, user=self.user)
#     view =  NationalityApiViewSet.as_view({'post': 'create'})
#     response =view(request)
#     return response

# def load_province(self,id,name,nationality):
#     province_data =  {  
#                          "id": id, 
#                          "name": name ,
#                          "nationality": nationality,
#                         }
#     url= reverse('province-list')
#     request = self.factory.post(url,province_data)
#     force_authenticate(request, user=self.user)
#     view =  ProvinceApiViewSet.as_view({'post': 'create'})
#     response =view(request)
#     return response

# def load_locality(self,id,name,province):
#     locality_data =  {  
#                          "id": id, 
#                          "name": name ,
#                          "province": province,
#                         }
#     url= reverse('locality-list')
#     request = self.factory.post(url,locality_data)
#     force_authenticate(request, user=self.user)
#     view =  LocalityApiViewSet.as_view({'post': 'create'})
#     response =view(request)
#     return response


# def load_family(self,id,postal,address):
#     nationality_data =  {  
#                          "id": id, 
#                          "postal": postal,
#                          "address": address,
#                         }
#     url= reverse('clients-list')
#     request = self.factory.post(url,nationality_data)
#     force_authenticate(request, user=self.user)
#     view =  ClientViewSet.as_view({'post': 'create'})
#     response =view(request)
#     return response

# def load_patrimony(self,id,postal,address):
#     nationality_data =  {  
#                          "id": id, 
#                          "postal": postal,
#                          "address": address,
#                         }
#     url= reverse('clients-list')
#     request = self.factory.post(url,nationality_data)
#     force_authenticate(request, user=self.user)
#     view =  ClientViewSet.as_view({'post': 'create'})
#     response =view(request)
#     return response

# def load_son(self,id,postal,address):
#     nationality_data =  {  
#                          "id": id, 
#                          "postal": postal,
#                          "address": address,
#                         }
#     url= reverse('clients-list')
#     request = self.factory.post(url,nationality_data)
#     force_authenticate(request, user=self.user)
#     view =  ClientViewSet.as_view({'post': 'create'})
#     response =view(request)
#     return response

# def load_tel(self,id,postal,address):
#     nationality_data =  {  
#                          "id": id, 
#                          "postal": postal,
#                          "address": address,
#                         }
#     url= reverse('clients-list')
#     request = self.factory.post(url,nationality_data)
#     force_authenticate(request, user=self.user)
#     view =  ClientViewSet.as_view({'post': 'create'})
#     response =view(request)
#     return response



# class TestSetUp(APITestCase):
#     def setUp(self):
#         self.factory = RequestFactory()
#         self.client = APIClient()
#         self.user = User.objects.create_superuser(username='admin',email='albertogsotelo9@gmail.com',password='',is_staff=True)
#         self.user.save()