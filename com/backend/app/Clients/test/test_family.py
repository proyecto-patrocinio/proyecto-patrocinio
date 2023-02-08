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




class Test_family(APITestCase):
  
    def setUp(self):    
        self.factory =APIRequestFactory()
        self.view = FamilyViewSet.as_view({'get':'retrieve'})
        self.url = reverse('family-list')
        self.client = APIClient()
        self.user=User.objects.create(username='admin',email='albertogsotelo9@gmail.com',password='',is_staff=True)
        self.user.save()
    
    def test_get_negative(self):
        
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.user)
        response =self.view(request, pk=1)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
    def test_post_negative_fam(self):
        load_clients(self,id=1,postal=2255,address="santa fe",marital_status="soltero/a",housing_type="Departamento",studies="Universitario Completo",locality=1,email="das@sadsa.com",id_type="Documento",
                     id_number=5454555,first_name="sdasd",last_name="sad",birth_date="1991-11-11",sex="Masculino")
        fam_data =  {"id": 5,"client_user_id": 1, "partner_salary":150_000
                            }
        request = self.factory.post(self.url,fam_data)
        force_authenticate(request, user=self.user)
        view = FamilyViewSet.as_view({'post':'create'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
