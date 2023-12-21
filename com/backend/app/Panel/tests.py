from rest_framework.test import APITestCase, APIRequestFactory
from rest_framework.test import force_authenticate
from rest_framework.test import APIClient
from datetime import datetime as dt, timedelta 
from rest_framework import status
from django.urls import reverse
from Consultation.models import Consultation, RequestConsultation
from Consultation.api.serializers import ConsultationCreateSerializer, RequestConsultationSerializer
from Clients.test.utils import load_dummy_client, setUpSuperUser
from Clients.models import Client
from Board.models import Board
from Panel.models import Panel
from Panel.api.viewsets import PanelViewSet
from Card.models import Card


class PanelViewSetTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = PanelViewSet.as_view({'get': 'retrieve', 'post': 'create', 'delete': 'destroy'})
        self.url = reverse('panel-list')
        setUpSuperUser(self)
        load_dummy_client(self)
        self.consultant = Client.objects.get(pk=1)
        self.board = Board.objects.create(title="dummy")

    def test_create_panel(self):
        data = {
            'title': 'dummy',
            'board': self.board.pk
        }
        request = self.factory.post(self.url, data=data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], data["title"])
        self.assertEqual(response.data["board"], data["board"])

    def test_create_panel_auth_error(self):
        data = {
            'title': 'dummy',
            'board': self.board.pk
        }
        request = self.factory.post(self.url, data=data)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_panel_without_board_error(self):
        error_board = 999
        data = {
            'title': 'dummy',
            'board': error_board
        }
        request = self.factory.post(self.url, data=data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_panels(self):
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.user)
        view =  PanelViewSet.as_view({'get': 'list'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_delete_panel_with_cards(self):
        panel = Panel.objects.create(title="dummy", board=self.board)
        consultation = Consultation.objects.create(
            availability_state="ASSIGNED", progress_state="TODO", time_stamp=dt.now(),
            description="dummy", client=self.consultant, opponent="dummy", tag="dummy"
        )
        card = Card.objects.create(consultation=consultation, tag="dummy", panel=panel)

        request = self.factory.delete(self.url)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=panel.pk)
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
