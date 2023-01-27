from django.test import SimpleTestCase
from django.urls import reverse, resolve
#from ...api_patrocinio.router import *
from Clients.api.viewsets import *

class Testurls(SimpleTestCase):
    
    def test_client_url_is_resolved(self):
        url = reverse('clients')
        print(resolve(url))
        # 1 == 2 
        #self.assertEquals(resolve(url).func, ClientViewSet)
        
    # def test_patrimony_url_is_resolved(self):
    #     url = reverse('patrimony')
    #     self.assertEquals(resolve(url).func, PatrimonyViewSet)
        
    # def test_family_url_is_resolved(self):
    #     url = reverse('family')
    #     self.assertEquals(resolve(url).func, FamilyViewSet)   
        
        
    # def test_son_url_is_resolved(self):
    #     url = reverse('son')
    #     self.assertEquals(resolve(url).func, SonViewSet)
        
    # def test_tel_url_is_resolved(self):
    #     url = reverse('tel')
    #     self.assertEquals(resolve(url).func, TelViewSet)
