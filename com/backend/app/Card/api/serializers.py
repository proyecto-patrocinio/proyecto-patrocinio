from Card.models import Card
from rest_framework import serializers


class CardCreateSerializer(serializers.ModelSerializer):
  class Meta:
    model = Card
    fields = ['consultation','tag','panel']


class CardSerializer(serializers.ModelSerializer):
  class Meta:
    model = Card
    fields = '__all__'
    read_only_fields = ("consultation",)


class CardLogSerializer(serializers.ModelSerializer):
    consultation_id = serializers.ReadOnlyField(source='consultation.id')
    start_time = serializers.ReadOnlyField(source='consultation.start_time')

    class Meta:
        model = Card
        fields = ['consultation_id', 'tag', 'start_time']
