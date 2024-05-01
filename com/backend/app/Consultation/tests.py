import json
from rest_framework.test import APITestCase, APIRequestFactory
from rest_framework.test import force_authenticate
from rest_framework.test import APIClient
from datetime import datetime as dt, timedelta 
from rest_framework import status
from django.urls import reverse
from Consultation.models import Consultation, RequestConsultation
from Consultation.api.serializers import ConsultationCreateSerializer, RequestConsultationSerializer
from Clients.test.utils import load_dummy_client, setUpSuperUser
from Consultation.api.views import ConsultationViewSet, RequestConsultationViewSet
from Clients.models import Client
from Board.models import Board


class ConsultationViewSetTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = ConsultationViewSet.as_view({'get': 'retrieve', 'post': 'create', 'delete': 'destroy'})
        self.url = reverse('consultation-list')
        setUpSuperUser(self)
        load_dummy_client(self)
        self.consultant = Client.objects.get(pk=1)

    def test_create_consultation(self):
        data = {
            'description': 'dummy',
            'client': self.consultant.pk,
            'opponent': 'dummy',
            'tag': 'dummy'
        }
        request = self.factory.post(self.url, data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['availability_state'],  'CREATED')
        self.assertEqual(response.data['progress_state'],  'TODO')
        self.assertEqual(response.data['tag'],  'dummy')


    def test_create_consultation_auth_error(self):
        data = {
            'description': 'dummy',
            'client': self.consultant.pk,
            'opponent': 'dummy',
            'tag': 'dummy'
        }
        request = self.factory.post(self.url, data)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_list_consultations(self):
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.user)
        view = ConsultationViewSet.as_view({'get':'list'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)


class RequestConsultationViewSetTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = RequestConsultationViewSet.as_view({'get': 'retrieve', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.url = reverse('request_consultation-list')
        setUpSuperUser(self)
        load_dummy_client(self)
        self.consultant = Client.objects.get(pk=1)
        self.board = Board.objects.create(title='Test Board')
        self.consultation = Consultation.objects.create(
            availability_state="CREATED", progress_state="TODO", time_stamp=dt.now(),
            description="dummy", client=self.consultant, opponent="dummy", tag="dummy"
        )

    def tearDown(self) -> None:
        RequestConsultation.objects.all().delete()
        return super().tearDown()

    def test_create_request_consultation(self):
        data = {
            'consultation': self.consultation.pk,
            'destiny_board': self.board.pk,
            'resolution_timestamp': "",
            "state": "PENDING",
        }
        request = self.factory.post(self.url, data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


    def test_create_request_consultation_failed(self):
        consultation_assigned = Consultation.objects.create(
            availability_state="ASSIGNED", progress_state="TODO", time_stamp=dt.now(),
            description="dummy", client=self.consultant, opponent="dummy", tag="dummy"
        )
        data = {
            'consultation': consultation_assigned.pk,
            'destiny_board': self.board.pk,
            'resolution_timestamp': "",
            "state": "PENDING",
        }
        request = self.factory.post(self.url, data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(
            "Consultation 2 is already assigned or there exists a pending request" ,
            response.data['error']
        )

    def test_list_request_consultations(self):
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.user)
        view = RequestConsultationViewSet.as_view({'get': 'list'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_request_consultations_auth_error(self):
        request = self.factory.get(self.url)
        view = RequestConsultationViewSet.as_view({'get': 'list'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
