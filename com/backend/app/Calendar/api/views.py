from django.shortcuts import render
from rest_framework import viewsets
from django.db.models import Prefetch
from Calendar.api.serializers import CalendarSerializer, EventSerializer, CalendarFullSerializer
from Calendar.models import Calendar, Event
from User.permissions import CheckGroupPermission
from django.shortcuts import get_object_or_404
from Card.models import Card
from rest_framework.response import Response
from rest_framework import status


class CalendarViewSet(viewsets.ModelViewSet):
    """API endpoint that allows CRUD operations on Calendar objects."""
    queryset = Calendar.objects.all()
    serializer_class = CalendarSerializer
    permission_classes = [CheckGroupPermission]

    def list(self, request, *args, **kwargs):
        card_id = request.GET.get('card_id', None)
        if card_id:
            card = get_object_or_404(Card,pk=card_id)
            calendar, isExist = Calendar.objects.get_or_create(card=card)
            serializer = CalendarFullSerializer(calendar)
            if isExist:
                return Response(serializer.data, status=200)
            return Response(serializer.data, status=201)

        return super().list(request, *args, **kwargs)

class EventViewSet(viewsets.ModelViewSet):
    """API endpoint that allows CRUD operations on Event objects."""
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [CheckGroupPermission]

    def list(self, request, *args, **kwargs):
        board_id = request.GET.get('board_id', None)
        if board_id:
            self.queryset =  self.queryset.filter(calendar__card__panel__board=board_id).all()
        return super().list(request, *args, **kwargs)
