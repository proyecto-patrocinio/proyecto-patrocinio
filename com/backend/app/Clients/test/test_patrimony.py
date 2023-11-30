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


class Test_partrimony(APITestCase):

    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = PatrimonyViewSet.as_view({'get': 'retrieve'})
        self.url = reverse('patrimony-list')
        self.client = APIClient()
        self.user = User.objects.create(username='admin', email='admin@admin.com', password='', is_staff=True)
        self.user.save()
        permissions = Permission.objects.all()
        super_group = Group.objects.create(name='super_group')
        super_group.permissions.set(permissions)
        self.user.groups.add(super_group)

    def test_get_negative(self):
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=1)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_post_positive_pat(self):
        load_dummy_client(self)
        pat_data = {
            "id": 1, "employment": "dummy", "salary": 200_000,
            "other_income": "No", "amount_other_income": 0, "amount_retirement": 6_000_000,
            "amount_pension": 3_000_000, "vehicle": "auto"
        }
        request = self.factory.post(self.url, pat_data)
        force_authenticate(request, user=self.user)
        view = PatrimonyViewSet.as_view({'post': 'create'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_put_positive(self):
        load_nationality(self, id=1, name="Argentina")
        load_province(self, id=1, name="Buenos Aires", nationality=1)
        load_locality(self, id=1, name="LANUS", province=1)
        load_dummy_client(self)
        load_patrimony(
            self, id=1, client=1, employment="dummy", salary=100_000,
            other_income="no", amount_other_income=0, amount_retirement=5_000_000,
            amount_pension=6_000_000, vehicle="auto"
        )
        data_new = {
            "id": 1, "client": 1, "employment": "other dummy", "salary": 10_000,
            "other_income": "no", "amount_other_income": 0, "amount_retirement": 10_000,
            "amount_pension": 10_000, "vehicle": "auto",
        }
        url = reverse('patrimony-list')
        request_update = self.factory.put(path=url, data=data_new, format='json')
        force_authenticate(request_update, user=self.user)
        view_update = PatrimonyViewSet.as_view({'put': 'update'})
        response_update = view_update(request_update, pk=1)
        self.assertEqual(response_update.status_code, status.HTTP_200_OK)
