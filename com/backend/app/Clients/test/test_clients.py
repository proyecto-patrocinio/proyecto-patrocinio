from rest_framework.test import APITestCase, APIRequestFactory
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User
from Clients.api.viewsets import *
from rest_framework.test import force_authenticate
from django.urls import reverse 
from rest_framework.test import APIClient
from locality.test.utils import *
from Clients.choices import *




class Test_clients(APITestCase):
  
    def setUp(self):    
        self.factory =APIRequestFactory()
        self.view = ClientViewSet.as_view({'get':'retrieve'})
        self.url = reverse('client-list')
        self.client = APIClient()
        self.user=User.objects.create(username='admin',email='albertogsotelo9@gmail.com',password='',is_staff=True)
        self.user.save()
    
    def test_get_negatives(self):
        
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.user)
        response =self.view(request, pk=1)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
    def test_post_positive_client(self):
        load_nationality(self,id=1,name="Argentina")
        load_province(self, id=1, name="Buenos Aires",nationality=1)
        load_locality(self, id=1, name="LANUS",province=1)
        clients_data =  {"id": 5, "postal": 1212,"address": "avenida santa fe",
                             "marital_status": 'S',
                             "housing_type":'Dp',"studies":'UC',"locality" : 1,"email" : 'dsadsa@com.com',"id_type": 'D',"id_number" : 55,
                             "first_name" : "asdasd","last_name" : "sdasd", "birth_date" : '1995-10-10',"sex" : 'F',
                            }
        
        
        request = self.factory.post(self.url,clients_data)
        force_authenticate(request, user=self.user)
        view = ClientViewSet.as_view({'post':'create'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
