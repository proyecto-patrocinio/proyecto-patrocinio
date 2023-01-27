from .utils import *

class Test_locality(TestSetUp):

    def test_post_positive_locality(self):
        #POST: LOAD LOCALITY
        load_nationality(self,id=1,name="Argentina")
        load_province(self, id=1, name="Buenos Aires",nationality=1)
        response = load_locality(self, id=1, name="Lanus",province=1)
        self.assertEqual( response.status_code, status.HTTP_201_CREATED)
        self.assertEqual( response.data['name'], "Lanus")
        self.assertEqual( response.data['id'], 1)

    def test_post_negative_1(self):
        #nationality does not exist...
        response_fail = load_locality(self, id="aaa", name="Lanus",province=1)
        self.assertEqual( response_fail.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_post_negative_2(self):
        #POST: FAIL LOAD LOCALITY (error in data:id)
        load_nationality(self,id=1,name="Argentina")
        load_province(self, id=1, name="Buenos Aires",nationality=1)
        load_locality(self, id="aaa", name="Lanus",province=1)
        response_fail = load_locality(self, id="aaa", name="Mar del Plata",province=1)
        self.assertEqual( response_fail.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_positive(self):
        #GET: GET LIST LOCALITY
        load_nationality(self,id=1,name="Argentina")
        load_province(self, id=1, name="Buenos Aires",nationality=1)
        load_locality(self, id=1, name="Lanus",province=1)
        #get: list...
        url= reverse('locality-list')
        request = self.factory.get(url)
        force_authenticate(request, user=self.user)
        view =  LocalityApiViewSet.as_view({'get': 'list'})
        response =view(request, pk=1)
        self.assertEqual( response.status_code, status.HTTP_200_OK)
        self.assertEqual( response.data[0]['id'], 1)
        self.assertEqual( response.data[0]['name'], "Lanus")

    def test_put_positive(self):
        #PUT: UPDATE LOCALITY
        load_nationality(self,id=1,name="Argentina")
        load_province(self, id=1, name="Buenos Aires",nationality=1)
        load_locality(self, id=1, name="LANUS",province=1)
        #update...
        data_new =  {
                    "id": 1,
                    "name": "Lanus" ,
                    "province": 1
                }
        url =reverse('locality-list')
        request_update = self.factory.put(path=url, data=data_new, format='json', content_type='application/json')
        force_authenticate(request_update, user=self.user)
        view_update =  LocalityApiViewSet.as_view({'put': 'update'})
        response_update =view_update(request_update, pk=1)
        self.assertEqual( response_update.status_code, status.HTTP_200_OK)
        self.assertEqual( response_update.data['name'], data_new['name'])
        self.assertEqual( response_update.data['id'], data_new['id'])

    def test_patch_positive(self):
        #PATCH: PARTIALTIAL UPDATE LOCALITY
        load_nationality(self,id=1,name="Argentina")
        load_province(self, id=1, name="Buenos Aires",nationality=1)
        load_locality(self, id=1, name="LANUS",province=1)
        #update...
        data_new =  {
                    "id": 1,
                    "name": "Lanus" ,
                }
        url = reverse('locality-list')
        request_update = self.factory.patch(path=url, data=data_new, format='json', content_type='application/json')
        force_authenticate(request_update, user=self.user)
        view_update =  LocalityApiViewSet.as_view({'patch': 'partial_update'})
        response_update =view_update(request_update, pk=1)
        self.assertEqual( response_update.status_code, status.HTTP_200_OK)
        self.assertEqual( response_update.data['name'], data_new['name'])
        self.assertEqual( response_update.data['id'], data_new['id'])

    def test_delete_negative(self):
        #DELETE: FAIL DELETE LOCALITY
        #locality not exist...
        url = reverse('locality-list')
        request_delete = self.factory.delete(url)
        force_authenticate(request_delete, user=self.user)
        view_delete =  LocalityApiViewSet.as_view({'delete': 'destroy'})
        response_delete =view_delete(request_delete, pk=1)
        self.assertEqual( response_delete.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_negative(self):
        #GET: FAIL GET LIST LOCALITY
        #locality not exist...
        url= reverse('locality-list')
        request2 = self.factory.get(url)
        force_authenticate(request2, user=self.user)
        view =  LocalityApiViewSet.as_view({'get': 'retrieve'})
        response =view(request2, pk=1)
        self.assertEqual( response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_delete_positive_cascade(self):
        #DELETE: DELETE LOCALITY CASCADE
        load_nationality(self,id=1,name="Argentina")
        load_province(self, id=1, name="Buenos Aires",nationality=1)
        load_locality(self, id=1, name="Lanus",province=1)
        #delete nationality
        url = reverse('nationality-list')
        request_delete = self.factory.delete(url)
        force_authenticate(request_delete, user=self.user)
        view_delete =  NationalityApiViewSet.as_view({'delete': 'destroy'})
        response_delete =view_delete(request_delete, pk=1)
        self.assertEqual( response_delete.status_code, status.HTTP_204_NO_CONTENT)
        #get province
        url = reverse('province-list')
        request_get = self.factory.get(url)
        force_authenticate(request_get, user=self.user)
        view_get =  ProvinceApiViewSet.as_view({'get': 'retrieve'})
        response_get =view_get(request_get, pk=1)
        self.assertEqual( response_get.status_code, status.HTTP_404_NOT_FOUND)
        #get: locality...
        url= reverse('locality-list')
        request2 = self.factory.get(url)
        force_authenticate(request2, user=self.user)
        view2 =  LocalityApiViewSet.as_view({'get': 'retrieve'})
        response2 =view2(request2, pk=1)
        self.assertEqual( response2.status_code, status.HTTP_404_NOT_FOUND)

