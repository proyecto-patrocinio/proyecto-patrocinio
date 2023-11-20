from Calendar.models import Calendar, Event
from rest_framework import serializers


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['id',]


class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendar
        fields = '__all__'
        read_only_fields = ['id',]


class CalendarFullSerializer(serializers.ModelSerializer):
    events = EventSerializer( many=True, read_only=True, required=False, allow_null=True)
    class Meta:
        model = Calendar
        fields = ['id', 'events', 'card']
        read_only_fields = ['id',]