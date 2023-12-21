from .utils import *
from rest_framework import status


class TestNationality(TestSetUp):

    def test_post_positive(self):
        # POST: #LOAD NATIONALITY
        response = load_nationality(self, id=1, name="Argentina")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_post_negative_id_not_unique(self):
        # POST: FAIL LOAD NATIONALITY (id not unique)
        load_nationality(self, id=1,name="Argentina")  # Post nationality
        response_fail = load_nationality(self, id=1, name="other country")
        self.assertEqual(response_fail.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_negative_2(self):
        # POST: FAIL LOAD NATIONALITY (error in data:id)
        response_fail = load_nationality(self, id="INVALID_ID", name="other country")
        self.assertEqual(response_fail.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_negative_not_authenticated(self):
        # POST: FAIL LOAD NATIONAL - NOT AUTHENTICATED
        url = reverse('nationality-list')
        request_fail = self.factory.post(url,{"id": 1, "name": "Argentina"})
        view_fail = NationalityApiViewSet.as_view({'post': 'create'})
        response_fail = view_fail(request_fail)
        self.assertEqual(response_fail.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_fail.data['detail'], "Authentication credentials were not provided.")

    def test_get_negative_not_authenticated(self):
        # GET: FAIL GET LIST NATIONALITIES - NOT AUTHENTICATED
        url = reverse('nationality-list')
        request_fail = self.factory.get(url)
        view_fail = NationalityApiViewSet.as_view({'get': 'list'})
        response_fail = view_fail(request_fail)
        self.assertEqual(response_fail.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response_fail.data['detail'], "Authentication credentials were not provided.")

    def test_get_positive(self):
        # GET: GET LIST NATIONALITIES
        load_nationality(self, id=1, name="Argentina")
        url = reverse('nationality-list')
        request = self.factory.get(url)
        force_authenticate(request, user=self.user)
        view = NationalityApiViewSet.as_view({'get': 'list'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['name'], "Argentina")
        self.assertEqual(response.data[0]['id'], 1)

    def test_put_positive(self):
        # PUT: UPDATE NATIONALITY
        load_nationality(self, id=1, name="Argentina")
        data_new = {
            "id": 1,
            "name": "afghanistan",
            "provinces": []
        }
        url = '/api/nationality/'
        request_update = self.factory.put(
            path=url, data=data_new, format='json', content_type='application/json'
        )
        force_authenticate(request_update, user=self.user)
        view_update = NationalityApiViewSet.as_view({'put': 'update'})
        response_update = view_update(request_update, pk=1)
        self.assertEqual(response_update.status_code, status.HTTP_200_OK)
        self.assertEqual(response_update.data['name'], data_new['name'])
        self.assertEqual(response_update.data['id'], data_new['id'])

    def test_patch_positive(self):
        # PATCH: PARTIALTIAL UPDATE NATIONALITY
        load_nationality(self, id=1, name="ARGENTINA")
        data_new = {
            "id": 1,
            "name": "Agentina",
        }
        url = '/api/nationality/'
        request_update = self.factory.patch(
            path=url, data=data_new, format='json', content_type='application/json'
        )
        force_authenticate(request_update, user=self.user)
        view_update = NationalityApiViewSet.as_view({'patch': 'partial_update'})
        response_update = view_update(request_update, pk=1)
        self.assertEqual(response_update.status_code, status.HTTP_200_OK)
        self.assertEqual(response_update.data['name'], data_new['name'])
        self.assertEqual(response_update.data['id'], data_new['id'])

    def test_delete_positive(self):
        # DELETE: DELETE NATIONALITY
        load_nationality(self,id=1,name="Argentina") 
        url = '/api/nationality/1/'
        request_delete = self.factory.delete(url)
        force_authenticate(request_delete, user=self.user)
        view_delete = NationalityApiViewSet.as_view({'delete': 'destroy'})
        response_delete = view_delete(request_delete, pk=1)
        self.assertEqual(response_delete.status_code, status.HTTP_204_NO_CONTENT)

    def test_get_negative_not_found(self):
        # GET: FAIL GET NATIONALITY
        url = '/api/nationality/1/'
        request2 = self.factory.get(url)
        force_authenticate(request2, user=self.user)
        view2 = NationalityApiViewSet.as_view({'get': 'retrieve'})
        response2 = view2(request2, pk=1)
        self.assertEqual(response2.status_code, status.HTTP_404_NOT_FOUND)
