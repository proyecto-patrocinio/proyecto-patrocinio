from rest_framework.test import APITestCase, APIRequestFactory
from django.urls import reverse, resolve
from rest_framework import status
from django.contrib.auth.models import User
from Clients.api.viewsets import *
from rest_framework.test import force_authenticate
from django.urls import reverse 
from django.test.client import  RequestFactory
from rest_framework.test import APIClient
from locality.test.utils import *
from Clients.test.utils import *


class Test_tel(APITestCase):

    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = TelViewSet.as_view({'get':'retrieve'})
        self.url = reverse('tel-list')
        self.client = APIClient()
        self.user=User.objects.create(username='admin', email='admin@admin.com', password='', is_staff=True)
        self.user.save()

    def test_get_negative(self):
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.user)
        response =self.view(request, pk=1)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_post_positive_tel(self):
        load_nationality(self,id=1, name="Argentina")
        load_province(self, id=1, name="Buenos Aires",nationality=1)
        load_locality(self, id=1, name="LANUS",province=1)
        load_dummy_client(self)
        tel_data =  {"id": 5, "phone_number": 1165799572, "client": 1}
        request = self.factory.post(self.url,tel_data)
        force_authenticate(request, user=self.user)
        view = TelViewSet.as_view({'post': 'create'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_put_positive_tel(self):
        load_nationality(self,id=1, name="Argentina")
        load_province(self, id=1, name="Buenos Aires",nationality=1)
        load_locality(self, id=1, name="LANUS",province=1)
        load_dummy_client(self)
        load_tel(self, id=1, phone_number=1165799975, client=1)
        tel_data =  {"id": 5, "phone_number": 1165799572, "client": 1}
        request = self.factory.put(path=self.url, data=tel_data, format='json', content_type=None)
        force_authenticate(request, user=self.user)
        view = TelViewSet.as_view({'put':'update'})
        response = view(request,pk=1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
