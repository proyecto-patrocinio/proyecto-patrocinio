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


class Test_son(APITestCase):

        def setUp(self):    
            self.factory =APIRequestFactory()
            self.view = SonViewSet.as_view({'get':'retrieve'})
            self.url = reverse('son-list')
            self.client = APIClient()
            self.user=User.objects.create(username='admin',email='albertogsotelo9@gmail.com',password='',is_staff=True)
            self.user.save()
            
            
            
        def test_post_positive_son(self):
        #POST: LOAD SON
            load_nationality(self,id=1,name="Argentina")
            load_province(self, id=1, name="Buenos Aires",nationality=1)
            load_locality(self, id=1, name="LANUS",province=1)
            load_clients(self,id=1,postal=2255,address="santa fe",marital_status="S",housing_type="Dp",studies="UC",locality=1,email="das@sadsa.com",id_type="D",
                        id_number=5454555,first_name="sdasd",last_name="sad",birth_date="1995-10-10",sex="M")
            load_family(self,id=1,client_user_id=1,partner_salary=120_000)
            
            son_data =  {"id": 1, "age": 25,"id_locality" : 1,"address": "avenida santa fe",
                                "family_client_user": 1
                                }
            request = self.factory.post(self.url,son_data)
            force_authenticate(request, user=self.user)
            view = SonViewSet.as_view({'post':'create'})
            response = view(request)
            self.assertEqual(response.status_code, status.HTTP_201_CREATED) 
            

  


        def test_get_positive(self):
            #GET: GET LIST SON
            url= reverse('son-list')
            request = self.factory.get(url)
            force_authenticate(request, user=self.user)
            view =  SonViewSet.as_view({'get': 'list'})
            response =view(request, pk=1)
            self.assertEqual( response.status_code, status.HTTP_200_OK)
            

        def test_put_positive(self):
            #PUT: UPDATE SON
            load_nationality(self,id=1,name="Argentina")
            load_province(self, id=1, name="Buenos Aires",nationality=1)
            load_locality(self, id=1, name="LANUS",province=1)
            load_clients(self,id=1,postal=2255,address="santa fe",marital_status="S",housing_type="Dp",studies="UC",locality=1,email="das@sadsa.com",id_type="D",
                        id_number=5454555,first_name="sdasd",last_name="sad",birth_date="1995-10-10",sex="M")
            load_family(self,id=1,client_user_id=1,partner_salary=120_000)
            load_son(self,id=1,age=25, id_locality=1,address="sante fe",family_client_user=1)
            data_new =  {
                        "id": 1, "age": 25,"id_locality" : 1,"address": "avenida santa fe",
                                "family_client_user": 1
                    }
            url =reverse('son-list')
            request_update = self.factory.put(path=url, data=data_new, format='json', content_type=None)
            force_authenticate(request_update, user=self.user)
            view_update =  SonViewSet.as_view({'put': 'update'})
            response_update =view_update(request_update, pk=1)
            self.assertEqual( response_update.status_code, status.HTTP_200_OK)
            self.assertEqual( response_update.data['age'], data_new['age'])
            self.assertEqual( response_update.data['id'], data_new['id'])
      

    

