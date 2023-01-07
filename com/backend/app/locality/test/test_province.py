from .utils import *

class TestProvinces(TestSetUp):

    def test_post_positive_province(self):
        #POST: LOAD PROVINCE
        load_nationality(self,id=1,name="Argentina") 
        response = load_province(self, id=1, name="Buenos Aires",nationality=1)
        self.assertEqual( response.status_code, status.HTTP_201_CREATED)
        self.assertEqual( response.data['name'], "Buenos Aires")
        self.assertEqual( response.data['id'], 1)
    
    def test_post_negative_1(self):
        #nationality does not exist...
        response_fail = load_province(self, id="aaa", name="Buenos Aires",nationality=1)
        self.assertEqual( response_fail.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_post_negative_2(self):
        #POST: FAIL LOAD PROVINCE (error in data:id)
        load_nationality(self,id=1,name="Argentina") 
        response_fail = load_province(self, id="aaa", name="Buenos Aires",nationality=1)
        self.assertEqual( response_fail.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_positive(self):
        #Load data
        load_nationality(self,id=1,name="Argentina")
        load_province(self, id=1, name="Buenos Aires",nationality=1)
        #GET: GET LIST PROVINCES
        url= reverse('province-list',)
        request_prov = self.factory.get(url)
        force_authenticate(request_prov, user=self.user)
        view2 =  ProvinceApiViewSet.as_view({'get': 'list'})
        response_prov =view2(request_prov) 
        self.assertEqual( response_prov.status_code, status.HTTP_200_OK)
        self.assertEqual( response_prov.data[0]['name'], "Buenos Aires")
        self.assertEqual( response_prov.data[0]['id'], 1)

    def test_put_positive(self):
        #PUT: UPDATE PROVINCE
        load_nationality(self, id=1, name="Argentina")
        load_province(self, id=1, name="BUENOS AIRES",nationality=1)
        #update...
        data_new =  {
                    "id": 1,
                    "name": "Buenos Aires" ,
                    "nationality": 1
                }
        url = reverse('province-list')
        request_update = self.factory.put(path=url,data=data_new, format='json', content_type='application/json')
        force_authenticate(request_update, user=self.user)
        view_update =  ProvinceApiViewSet.as_view({'put': 'update'})
        response_update =view_update(request_update, pk=1)
        self.assertEqual( response_update.status_code, status.HTTP_200_OK)
        self.assertEqual( response_update.data['name'], data_new['name'])
        self.assertEqual( response_update.data['id'], data_new['id'])

    def test_patch_positive(self):
        #PATCH: PARTIALTIAL UPDATE PROVINCE
        load_nationality(self, id=1, name="Argentina")
        load_province(self, id=1, name="BUENOS AIRES",nationality=1)
        #update...
        data_new =  {
                    "id": 1,
                    "name": "Buenos Aires" ,
                    }
        url = reverse('nationality-list')
        request_update = self.factory.patch(path=url,data=data_new, format='json', content_type='application/json')
        force_authenticate(request_update, user=self.user)
        view_update =  ProvinceApiViewSet.as_view({'patch': 'partial_update'})
        response_update =view_update(request_update, pk=1)
        self.assertEqual( response_update.status_code, status.HTTP_200_OK)
        self.assertEqual( response_update.data['name'], data_new['name'])
        self.assertEqual( response_update.data['id'], data_new['id'])

    def test_delete_positive_cascade(self):
        #DELETE: DELETE LOCALITY CASCADE
        load_nationality(self,id=1,name="Argentina")
        response_load = load_province(self, id=1, name="Buenos Aires",nationality=1)
        self.assertEqual( response_load.status_code, status.HTTP_201_CREATED)

        #delete nationality
        url = reverse('nationality-list')
        request_delete = self.factory.delete(url)
        force_authenticate(request_delete, user=self.user)
        view_delete =  NationalityApiViewSet.as_view({'delete': 'destroy'})
        response_delete =view_delete(request_delete, pk=1)
        self.assertEqual( response_delete.status_code, status.HTTP_204_NO_CONTENT)
        
        #get province
        url_2 = '/api/province/1/'
        request_get = self.factory.get(url_2)
        force_authenticate(request_get, user=self.user)
        view_get =  ProvinceApiViewSet.as_view({'get': 'retrieve'})
        response_get =view_get(request_get, pk=1)
        self.assertEqual( response_get.status_code, status.HTTP_404_NOT_FOUND)



    def test_get_negative(self):
        #GET: GET PROVINCE
        #province not exists
        url= reverse('province-list')
        request2 = self.factory.get(url)
        force_authenticate(request2, user=self.user)
        view2 =  ProvinceApiViewSet.as_view({'get': 'retrieve'})
        response2 =view2(request2, pk=1)
        self.assertEqual( response2.status_code, status.HTTP_404_NOT_FOUND)
