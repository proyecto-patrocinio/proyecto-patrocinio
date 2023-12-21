import os
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from django.urls import reverse
from django.test.client import  RequestFactory
from django.contrib.auth.models import User
from rest_framework.test import force_authenticate
from terms_and_policies.viewsets import get_file_contentView, download_file_contentView


class TestSetUp(APITestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.client = APIClient()
        self.user = User.objects.create_superuser(
            username='admin', email='admin@user.com', password='53cur3_?a55w0rd', is_staff=True
        )
        self.user.save()


class FileContentAPITestCase(TestSetUp):

    def test_get_file_content_view(self):
        url = reverse('get_terms_and_policies')
        request = self.factory.get(url)
        force_authenticate(request, user=self.user)
        response = get_file_contentView(request)
        self.assertEqual(response.status_code, 200)

    def test_download_file_content_view(self):
        url = reverse('download_terms_and_policies')
        request = self.factory.get(url)
        force_authenticate(request, user=self.user)
        response = download_file_contentView(request)
        self.assertEqual(response.status_code, 200)
