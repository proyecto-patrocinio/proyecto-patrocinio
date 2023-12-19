from Board.models import *
from rest_framework import serializers
from BoardUser.api.serializers import BoardUserSerializer
from Panel.api.serializers import PanelWithNumberCardsSerializer, PanelFullSerializer
from Consultation.api.serializers import RequestConsultationSerializer


class BoardSerializer(serializers.ModelSerializer):
  class Meta:
    model = Board
    fields = ['id', 'title']

class BoardFullSerializer(serializers.ModelSerializer):
  boardusers = BoardUserSerializer( many = True, read_only = True )
  panels = PanelFullSerializer(many = True, read_only = True )
  request_consultations = RequestConsultationSerializer(many = True, read_only = True)
  class Meta:
    model = Board
    fields = ['id', 'title', 'boardusers',"panels", "request_consultations"]
    read_only_fields = ("panels","boardusers", "request_consultations")

class BoardListSerializer(serializers.ModelSerializer):
  number_cards = serializers.IntegerField()
  class Meta:
    model = Board
    fields = ['id', 'title', 'number_cards']
    read_only_fields = ("number_cards",)

class ConsultancyListSerializer(serializers.ModelSerializer):
  number_cards = serializers.IntegerField()
  cards = RequestConsultationSerializer(many = True, read_only = True)
  todo_count = serializers.IntegerField()
  in_progress_count = serializers.IntegerField()
  done_count = serializers.IntegerField()
  paused_count = serializers.IntegerField()
  blocked_count = serializers.IntegerField()
  incomplete_count = serializers.IntegerField()
  class Meta:
    model = Board
    fields = [
      'id', 'title', 'number_cards', 'cards', 'todo_count', 'in_progress_count',
      'done_count', 'paused_count', 'blocked_count', 'incomplete_count'
    ]
    read_only_fields = ("number_cards", "cards")
