from Card.models import Card
from rest_framework import serializers

class CardSerializer(serializers.ModelSerializer):
  class Meta:
    model = Card
    #fields = ['consultation','tag', 'panel']
    fields = '__all__' 

  