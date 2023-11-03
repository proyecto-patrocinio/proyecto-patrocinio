from Clients.api.viewsets import *
from rest_framework.test import force_authenticate
from django.urls import reverse 
from locality.test.utils import *

# Auxiliary functions

def load_clients(self, id, postal, address, marital_status, housing_type, studies, locality,
                email, id_type, id_value, first_name, last_name, birth_date, sex):
    client_data = {
        "id": id, "postal": postal,"address": address,
        "marital_status":marital_status,
        "housing_type":housing_type,"studies" :studies, "locality":locality,"email" :email,
        "id_type": id_type,"id_value" : id_value, "first_name" : first_name,"last_name" : last_name,
        "birth_date" : birth_date,"sex" : sex
    }
    url = reverse('client-list')
    request = self.factory.post(url, client_data)
    force_authenticate(request, user=self.user)
    view =  ClientViewSet.as_view({'post': 'create'})
    response =view(request)
    return response


def load_family(self, id, client, partner_salary):
    family_data = {
        "id": id, 
        "client": client,
        "partner_salary": partner_salary
    }
    url= reverse('family-list')
    request = self.factory.post(url, family_data)
    force_authenticate(request, user=self.user)
    view = FamilyViewSet.as_view({'post': 'create'})
    response = view(request)
    return response


def load_son(self, id, age, locality, address, family_client_user):
    son_data = {
        "id": id, "age": age,"locality" : locality,"address": address,
        "family_client_user": family_client_user
    }
    url= reverse('son-list')
    request = self.factory.post(url,son_data)
    force_authenticate(request, user=self.user)
    view = SonViewSet.as_view({'post': 'create'})
    response = view(request)
    return response


def load_tel(self,id,phone_number,client):
    tel_data = {"id": id, "phone_number": phone_number, "client": client}
    url = reverse('tel-list')
    request = self.factory.post(url, tel_data)
    force_authenticate(request, user=self.user)
    view = TelViewSet.as_view({'post': 'create'})
    response = view(request)
    return response


def load_patrimony(self, id, client, employment, salary, other_income,
                   amount_other_income, amount_retirement, amount_pension, vehicle):
    pat_data = {
        "id": id, "client": client, "employment": employment, "salary": salary,
        "other_income": other_income, "amount_other_income": amount_other_income,
        "amount_retirement": amount_retirement, "amount_pension": amount_pension, 
        "vehicle": vehicle,
    }
    url = reverse('patrimony-list')
    request = self.factory.post(path=url, data=pat_data, format='json')
    force_authenticate(request, user=self.user)
    view = PatrimonyViewSet.as_view({'post': 'create'})
    response = view(request)
    return response


def load_dummy_client(self):
    load_nationality(self, id=1, name="Argentina")
    load_province(self, id=1, name="Buenos Aires", nationality=1)
    load_locality(self, id=1, name="LANUS", province=1)
    clients_data = {
        "id": 1, "postal": 1212, "address": "avenida santa fe",
        "marital_status": 'SINGLE',
        "housing_type": 'HOUSE', "studies": 'INCOMPLETE_PRIMARY', "locality": 1, "email": 'dummy@dummy.com',
        "id_type": 'DOCUMENT', "id_value": "55", "first_name": "dummy_name", "last_name": "dummy_last_name",
        "birth_date": '1995-10-10', "sex": 'MALE',
    }
    request = self.factory.post(self.url, clients_data)
    force_authenticate(request, user=self.user)
    view = ClientViewSet.as_view({'post': 'create'})
    response = view(request)
    return response
