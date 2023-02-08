from rest_framework.test import APITestCase, APIRequestFactory
from django.urls import reverse, resolve
from rest_framework import status
from django.contrib.auth.models import User
from Clients.api.viewsets import *
from rest_framework.test import force_authenticate
from django.urls import reverse 
from django.test.client import  RequestFactory
from rest_framework.test import APIClient



class Test_son(APITestCase):

        def setUp(self):    
            self.factory =APIRequestFactory()
            self.view = ClientViewSet.as_view({'get':'retrieve'})
            self.url = reverse('son-list')
            self.client = APIClient()
            self.user=User.objects.create(username='admin',email='albertogsotelo9@gmail.com',password='',is_staff=True)
            self.user.save()
            
            
            
        def test_post_negative_son(self):
        #POST: LOAD SON
            son_data =  {"id": 5, "age": 25,"id_locality" : 58,"address": "avenida santa fe",
                                "family_client_user": 2
                                }
            request = self.factory.post(self.url,son_data)
            force_authenticate(request, user=self.user)
            view = SonViewSet.as_view({'post':'create'})
            response = view(request)
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) 
            

  


        def test_get_positive(self):
            #GET: GET LIST SON
            url= reverse('son-list')
            request = self.factory.get(url)
            force_authenticate(request, user=self.user)
            view =  SonViewSet.as_view({'get': 'list'})
            response =view(request, pk=1)
            self.assertEqual( response.status_code, status.HTTP_200_OK)
            

        def test_put_negative(self):
            #PUT: UPDATE SON
    
            #update...
            data_new =  {
                        "id": 5, "age": 25,"id_locality" : 58,"address": "avenida santa fe",
                                "family_client_user": 2
                    }
            url =reverse('son-list')
            request_update = self.factory.put(path=url, data=data_new, content_type='application/json')
            force_authenticate(request_update, user=self.user)
            view_update =  SonViewSet.as_view({'put': 'update'})
            response_update =view_update(request_update, pk=1)
            self.assertEqual( response_update.status_code, status.HTTP_404_NOT_FOUND)
      

    

