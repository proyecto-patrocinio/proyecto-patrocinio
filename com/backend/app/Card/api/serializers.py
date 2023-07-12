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
