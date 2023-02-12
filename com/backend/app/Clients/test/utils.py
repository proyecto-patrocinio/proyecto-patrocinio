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

def load_family(self,id,client_user_id,partner_salary):
    family_data =  {  
                         "id": id, 
                         "client_user_id": client_user_id,
                         "partner_salary": partner_salary
                        }
    url= reverse('family-list')
    request = self.factory.post(url,family_data)
    force_authenticate(request, user=self.user)
    view =  FamilyViewSet.as_view({'post': 'create'})
    response =view(request)
    return response


def load_son(self,id,age, id_locality,address,family_client_user):
    son_data =  {"id": id, "age": age,"id_locality" : id_locality,"address": address,
                                "family_client_user": family_client_user
                                }
    url= reverse('son-list')
    request = self.factory.post(url,son_data)
    force_authenticate(request, user=self.user)
    view =  SonViewSet.as_view({'post': 'create'})
    response =view(request)
    return response




def load_tel(self,id,phone_number,client):
    tel_data =  {"id": id, "phone_number": phone_number, "client": client
                                }
    url= reverse('tel-list')
    request = self.factory.post(url,tel_data)
    force_authenticate(request, user=self.user)
    view =  TelViewSet.as_view({'post': 'create'})
    response =view(request)
    return response


def load_patrimony(self,id,client_user_id,employment,salary,other_income,amount_other_income,amount_retirement,amount_pension,vehicle):
    pat_data =  {"id": id,"client_user_id": client_user_id, "employment":"employment","salary":salary, "other_income":other_income,"amount_other_income":amount_other_income,
                     "amount_retirement":amount_retirement,"amount_pension":amount_pension,"vehicle":vehicle,
                            }
    url= reverse('patrimony-list')
    request = self.factory.post(url,pat_data)
    force_authenticate(request, user=self.user)
    view =  PatrimonyViewSet.as_view({'post': 'create'})
    response =view(request)
    return response