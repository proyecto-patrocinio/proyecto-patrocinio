from rest_framework.test import APITestCase, APIRequestFactory
from datetime import datetime as dt, timedelta
from rest_framework.test import force_authenticate
from django.urls import reverse
from rest_framework import status
from django.test import TestCase
from Card.models import Card
from Card.api.viewsets import CardViewSet
from Panel.models import Panel
from Consultation.models import Consultation
from Board.models import Board
from Clients.models import Client
from Clients.test.utils import load_dummy_client, setUpSuperUser


class CardModelTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = CardViewSet.as_view({'get': 'retrieve', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.url = reverse('card-list')
        setUpSuperUser(self)
        load_dummy_client(self)
        self.consultant = Client.objects.get(pk=1)
        self.board = Board.objects.create(title='Test Board')
        self.panel = Panel.objects.create(title="dummy_panel", board=self.board)
        self.consultation = Consultation.objects.create(
            availability_state="ASSIGNED", progress_state="TODO", time_stamp=dt.now(),
            description="dummy", client=self.consultant, opponent="dummy", tag="dummy"
        )

    def test_create_card(self):
        data = {
            "consultation": self.consultation.id,
            "tag": 'dummy',
            "panel": self.panel.id
        }
        url = reverse('card-list')
        request = self.factory.post(url, data)
        force_authenticate(request, user=self.user)
        response = self.view(request)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['tag'], data['tag'])

    def test_card_str_method(self):
        """Check __str__ method"""
        card = Card.objects.create(
            consultation=self.consultation,
            tag='Test Tag',
            panel=self.panel
        )

        self.assertEqual(str(card), 'Test Tag')

    def test_create_card_auth_error(self):
        data = {
            "consultation": self.consultation.id,
            "tag": 'dummy',
            "panel": self.panel.id
        }
        url = reverse('card-list')
        request = self.factory.post(url, data)
        response = self.view(request)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_card_auth_error(self):
        data = {
            "consultation": self.consultation.id,
            "tag": 'dummy',
            "panel": self.panel.id
        }
        url = reverse('card-list')
        request = self.factory.get(url, data)
        response = self.view(request)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

from django.test import TestCase
from Card.models import Card
from Card.api.serializers import CardCreateSerializer, CardSerializer, CardLogSerializer
from Consultation.models import Consultation
from datetime import datetime

class CardSerializersTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = CardViewSet.as_view({'get': 'retrieve', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.url = reverse('card-list')
        setUpSuperUser(self)
        load_dummy_client(self)
        self.consultant = Client.objects.get(pk=1)
        self.board = Board.objects.create(title='Test Board')
        self.panel = Panel.objects.create(title="dummy_panel", board=self.board)
        self.consultation = Consultation.objects.create(
            availability_state="ASSIGNED", progress_state="TODO", time_stamp=dt.now(),
            description="dummy", client=self.consultant, opponent="dummy", tag="dummy"
        )

    def test_card_create_serializer(self):
        data = {
            'consultation': self.consultation.id,
            'tag': 'Test Tag',
            'panel': self.panel.id, 
        }

        serializer = CardCreateSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_card_create_serializer_faild(self):
        error_panel = 999
        data = {
            'consultation': self.consultation.id,
            'tag': 'Test Tag',
            'panel': error_panel
        }

        serializer = CardCreateSerializer(data=data)
        self.assertFalse(serializer.is_valid())

    def test_card_serializer(self):
        card = Card.objects.create(
            consultation=self.consultation,
            tag='Test Tag',
            panel=self.panel,
        )

        serializer = CardSerializer(instance=card)
        self.assertIn('consultation', serializer.data)

    def test_card_log_serializer(self):
        card = Card.objects.create(
            consultation=self.consultation,
            tag='Test Tag',
            panel=self.panel,
        )

        serializer = CardLogSerializer(instance=card)
        self.assertIn('consultation_id', serializer.data)
        self.assertIn('start_time', serializer.data)
