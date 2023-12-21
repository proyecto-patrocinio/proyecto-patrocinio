from rest_framework.test import APITestCase, APIRequestFactory
from django.urls import reverse
from rest_framework import status
from rest_framework.test import force_authenticate
from Card.models import Card
from datetime import datetime as dt, timedelta
from Calendar.models import Calendar, Event
from Calendar.api.views import CalendarViewSet, EventViewSet
from django.contrib.auth.models import User
from Clients.test.utils import load_dummy_client, setUpSuperUser
from Clients.models import Client
from Board.models import Board
from Consultation.models import Consultation
from Panel.models import Panel


class CalendarViewSetTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = CalendarViewSet.as_view({'get': 'retrieve'})
        self.url = reverse('calendar-list')
        setUpSuperUser(self)
        load_dummy_client(self)
        self.consultant = Client.objects.get(pk=1)
        self.board = Board.objects.create(title='Test Board')
        self.panel = Panel.objects.create(title="dummy_panel", board=self.board)
        self.consultation = Consultation.objects.create(
            availability_state="ASSIGNED", progress_state="TODO", time_stamp=dt.now(),
            description="dummy", client=self.consultant, opponent="dummy", tag="dummy"
        )
        self.card = Card.objects.create(panel=self.panel, consultation=self.consultation, tag="dummy")

    def test_list_calendars(self):
        url = reverse('calendar-list')
        request = self.factory.get(url)
        force_authenticate(request, user=self.user)
        view = CalendarViewSet.as_view({'get': 'list'})
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_calendar_existing_card(self):
        url = reverse('calendar-list')
        request = self.factory.get(url, {'card_id': self.card.pk})
        force_authenticate(request, user=self.user)
        view = CalendarViewSet.as_view({'get': 'list'})
        response = view(request)
        expected_data = {'id': 1, 'events': [], 'card': 1}

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, expected_data)


class EventViewSetTestCase(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = CalendarViewSet.as_view({'get': 'retrieve'})
        self.url = reverse('calendar-list')
        setUpSuperUser(self)
        load_dummy_client(self)
        self.consultant = Client.objects.get(pk=1)
        self.board = Board.objects.create(title='Test Board')
        self.panel = Panel.objects.create(title="dummy_panel", board=self.board)
        self.consultation = Consultation.objects.create(
            availability_state="ASSIGNED", progress_state="TODO", time_stamp=dt.now(),
            description="dummy", client=self.consultant, opponent="dummy", tag="dummy"
        )
        self.card = Card.objects.create(panel=self.panel, consultation=self.consultation, tag="dummy")

    def test_list_events(self):
        url = reverse('event-list')
        request = self.factory.get(url)
        force_authenticate(request, user=self.user)
        view = EventViewSet.as_view({'get': 'list'})
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_list_events_with_board_id(self):
        url = reverse('event-list')
        request = self.factory.get(url, {'board_id': self.board.id})
        force_authenticate(request, user=self.user)
        view = EventViewSet.as_view({'get': 'list'})
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_event(self):
        Calendar.objects.create(card=self.card)
        start_time = dt.now()
        end_time = start_time + timedelta(hours=2)

        data = {
            'title': 'dummy',
            'description': 'dummy',
            'start': start_time,
            'end': end_time,
            'calendar': 1,
        }

        url = reverse('event-list')
        request = self.factory.post(url, data=data, format='json')
        force_authenticate(request, user=self.user)
        view = EventViewSet.as_view({'post': 'create'})
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Event.objects.filter(title='dummy').exists())

        self.assertEqual(response.data['title'], data['title'])
        self.assertEqual(response.data['description'], data['description'])
        self.assertEqual(response.data['start'], start_time.strftime('%Y-%m-%dT%H:%M:%S.%fZ'))
        self.assertEqual(response.data['end'], end_time.strftime('%Y-%m-%dT%H:%M:%S.%fZ'))
