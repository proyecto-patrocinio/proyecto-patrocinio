from rest_framework.test import APITestCase, APIRequestFactory
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User
from Clients.api.viewsets import *
from rest_framework.test import force_authenticate
from django.urls import reverse 
from rest_framework.test import APIClient

from Clients.test.utils import load_dummy_client
from locality.test.utils import *
from Clients.choices import *




class Test_clients(APITestCase):

    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = ClientViewSet.as_view({'get':'retrieve'})
        self.url = reverse('client-list')
        self.client = APIClient()
        self.user = User.objects.create(username='admin', email='admin@dummy.com', password='', is_staff=True)
        self.user.save()

    def test_get_negatives(self):
        
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=1)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_post_positive_client(self):
        response = load_dummy_client(self)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
