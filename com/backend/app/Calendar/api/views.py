from django.shortcuts import render
from rest_framework import viewsets
from django.db.models import Prefetch
from Calendar.api.serializers import CalendarSerializer, EventSerializer, CalendarFullSerializer
from Calendar.models import Calendar, Event
from User.permissions import CheckGroupPermission


class CalendarViewSet(viewsets.ModelViewSet):
    """API endpoint that allows CRUD operations on Calendar objects."""
    queryset = Calendar.objects.all()
    serializer_class = CalendarSerializer
    permission_classes = [CheckGroupPermission]

    def retrieve(self, request, *args, **kwargs):
        self.queryset = queryset = self.queryset.prefetch_related(Prefetch("events"))
        self.serializer_class = CalendarFullSerializer
        return self.super().retrieve(request, *args, **kwargs)


class EventViewSet(viewsets.ModelViewSet):
    """API endpoint that allows CRUD operations on Event objects."""
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [CheckGroupPermission]
