from rest_framework.test import APITestCase, APIRequestFactory
from django.urls import reverse, resolve
from rest_framework import status
from django.contrib.auth.models import User, Group, Permission
from Clients.api.viewsets import *
from rest_framework.test import force_authenticate
from django.urls import reverse 
from django.test.client import  RequestFactory
from rest_framework.test import APIClient
from locality.test.utils import *
from Clients.test.utils import *


class Test_child(APITestCase):

    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = childViewSet.as_view({'get': 'retrieve'})
        self.url = reverse('child-list')
        setUpSuperUser(self)

    def test_post_positive_child(self):
        load_dummy_client(self)
        load_family(self, id=1, client=1, partner_salary=120_000)
        child_data =  {
            "id": 1, "birth_date": "2023-12-10", "locality": 1, "address": "avenida santa fe",
            "family_client_user": 1, 
            "first_name": "dummy_name", "last_name": "dummy_last_name", "id_type": "PASSPORT",
            "id_value": "DUMMY", "sex": "MALE"
        }
        request = self.factory.post(self.url, child_data)
        force_authenticate(request, user=self.user)
        view = childViewSet.as_view({'post': 'create'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED) 

    def test_get_positive(self):
        url= reverse('child-list')
        request = self.factory.get(url)
        force_authenticate(request, user=self.user)
        view =  childViewSet.as_view({'get': 'list'})
        response =view(request, pk=1)
        self.assertEqual( response.status_code, status.HTTP_200_OK)

    def test_put_positive(self):
        load_dummy_client(self)
        load_family(self, id=1, client=1, partner_salary=120_000)
        load_child(self,id=1,birth_date="2023-12-10", locality=1, address="sante fe", family_client_user=1)
        data_new =  {
            "id": 1, "birth_date": "2023-12-10", "locality" : 1,"address": "avenida santa fe",
            "family_client_user": 1,
            "first_name": "dummy_name", "last_name": "dummy_last_name", "id_type": "PASSPORT",
            "id_value": "DUMMY", "sex": "MALE"
        }
        url = reverse('child-list')
        request_update = self.factory.put(path=url, data=data_new, format='json', content_type=None)
        force_authenticate(request_update, user=self.user)
        view_update = childViewSet.as_view({'put': 'update'})
        response_update = view_update(request_update, pk=1)
        self.assertEqual( response_update.status_code, status.HTTP_200_OK)
        self.assertEqual( response_update.data['birth_date'], data_new['birth_date'])
        self.assertEqual( response_update.data['id'], data_new['id'])
