from Board.models import *
from rest_framework import serializers
from BoardUSer.api.serializers import BoardUserSerializer
from Panel.api.serializers import PanelWithNumberCardsSerializer, PanelFullSerializer

class BoardSerializer(serializers.ModelSerializer):
  class Meta:
    model = Board
    fields = ['id', 'title', 'is_consultancy']

class BoardFullSerializer(serializers.ModelSerializer):
  boardusers = BoardUserSerializer( many = True, read_only = True )
  panels = PanelFullSerializer(many = True, read_only = True )
  class Meta:
    model = Board
    fields = ['id', 'title', 'is_consultancy', 'boardusers',"panels"]
    read_only_fields = ("panels","boardusers")

class BoardListSerializer(serializers.ModelSerializer):
  number_cards = serializers.IntegerField()
  class Meta:
    model = Board
    fields = ['id', 'title', 'is_consultancy', 'number_cards']
    read_only_fields = ("number_cards",)
