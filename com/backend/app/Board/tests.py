from rest_framework.test import APITestCase, APIRequestFactory
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from datetime import timedelta
from django.utils import timezone
from datetime import datetime as dt
from rest_framework.test import force_authenticate

from Board.models import Board
from Board.api.viewsets import BoardViewSet
from Panel.models import Panel
from Consultation.models import Consultation
from Card.models import Card
from Clients.models import Client
from Clients.test.utils import load_dummy_client, setUpSuperUser


class BoardViewSetTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = BoardViewSet.as_view({'get': 'retrieve'})
        self.url = reverse('board-list')
        setUpSuperUser(self)
        load_dummy_client(self)
        self.consultant = Client.objects.get(pk=1)
        self.board = Board.objects.create(title='Test Board')
        self.panel = Panel.objects.create(title="dummy_panel", board=self.board)
        self.consultation = Consultation.objects.create(
            availability_state="ASSIGNED", progress_state="TODO", time_stamp=dt.now(),
            description="dummy", client=self.consultant, opponent="dummy", tag="dummy"
        )
        self.card = Card.objects.create(panel=self.board.panels.first(), consultation=self.board.request_consultations.first())

    def test_list_boards(self):
        request = self.factory.get(self.url)
        force_authenticate(request, user=self.user)
        view = BoardViewSet.as_view({'get': 'list'})
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('number_cards', response.data[0])

    def test_retrieve_board(self):
        request = self.factory.get(reverse('board-detail', kwargs={'pk': self.board.pk}))
        force_authenticate(request, user=self.user)
        view = BoardViewSet.as_view({'get': 'retrieve'})
        response = view(request, pk=self.board.pk)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('request_consultations', response.data)
        self.assertIn('boardusers', response.data)
        self.assertIn('panels', response.data)
        self.assertEqual(0, len(response.data['request_consultations']))
        self.assertEqual(self.board.id, response.data["id"])

    def test_consultancy_board(self):
        request = self.factory.get(reverse('board-consultancy-board'))
        force_authenticate(request, user=self.user)
        view = BoardViewSet.as_view({'get': 'consultancy_board'})
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(0, response.data["id"])
        self.assertEqual("Consultancy", response.data["title"])
        self.assertEqual(1, len(response.data["panels"]))
        self.assertIn('panels', response.data)

    def test_logs(self):
        request = self.factory.get(reverse('board-logs', kwargs={'pk': self.board.pk}) + f'?days=7')
        force_authenticate(request, user=self.user)
        view = BoardViewSet.as_view({'get': 'logs'})
        response = view(request, pk=self.board.pk)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_logs_missing_days_param(self):
        request = self.factory.get(reverse('board-logs', kwargs={'pk': self.board.pk}))
        force_authenticate(request, user=self.user)
        view = BoardViewSet.as_view({'get': 'logs'})
        response = view(request, pk=self.board.pk)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_logs_invalid_days_param(self):
        request = self.factory.get(reverse('board-logs', kwargs={'pk': self.board.pk}) + '?days=invalid')
        force_authenticate(request, user=self.user)
        view = BoardViewSet.as_view({'get': 'logs'})
        response = view(request, pk=self.board.pk)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)