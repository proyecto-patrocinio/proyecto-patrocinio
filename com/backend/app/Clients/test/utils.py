from Clients.api.viewsets import *
from rest_framework.test import force_authenticate
from django.urls import reverse 
from locality.test.utils import *
from django.contrib.auth.models import User, Group, Permission
from rest_framework.test import APIClient


# Auxiliary functions

def setUpSuperUser(self) -> None:
        """Set up a superuser for testing with an API client, 'admin' user, and 'super_group' with all permissions."""
        self.client = APIClient()
        self.user = User.objects.create(username='admin', email='admin@admin.com', password='', is_staff=True)
        self.user.save()
        permissions = Permission.objects.all()
        super_group = Group.objects.create(name='super_group')
        super_group.permissions.set(permissions)
        case_taker_group = Group.objects.create(name='case_taker')
        professor_group = Group.objects.create(name='professor')
        self.user.groups.add(super_group)
        self.user.groups.add(case_taker_group)
        self.user.groups.add(professor_group)

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


def load_child(self, id, birth_date, locality, address, client_user):
    child_data = {
        "id": id, "birth_date": birth_date,"locality" : locality,"address": address,
        "client_user": client_user,
        "first_name": "dummy_name", "last_name": "dummy_last_name", "id_type": "PASSPORT",
        "id_value": "DUMMY", "sex": "MALE"
    }
    url= reverse('child-list')
    request = self.factory.post(url, child_data)
    force_authenticate(request, user=self.user)
    view = childViewSet.as_view({'post': 'create'})
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




def load_dummy_client(self):
    load_nationality(self, id=1, name="Argentina")
    load_province(self, id=1, name="Buenos Aires", nationality=1)
    load_locality(self, id=1, name="LANUS", province=1)
    clients_data = {
        "id": 1, "postal": 1212, "address": "avenida santa fe",
        "marital_status": 'SINGLE',
        "housing_type": 'HOUSE', "studies": 'INCOMPLETE_PRIMARY', "locality": 1, "email": 'dummy@dummy.com',
        "id_type": 'PASSPORT', "id_value": "DUMMY", "first_name": "dummy_name", "last_name": "dummy_last_name",
        "birth_date": '1995-10-10', "sex": 'MALE',
    }
    request = self.factory.post(self.url, clients_data)
    force_authenticate(request, user=self.user)
    view = ClientViewSet.as_view({'post': 'create'})
    response = view(request)
    return response
