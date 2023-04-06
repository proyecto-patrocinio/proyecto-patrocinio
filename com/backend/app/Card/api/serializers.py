from Card.models import Card
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

class CardSerializer(serializers.ModelSerializer):
  class Meta:
    model = Card
    # fields = ['consultation','tag', 'panel']
    fields = 'all'

  