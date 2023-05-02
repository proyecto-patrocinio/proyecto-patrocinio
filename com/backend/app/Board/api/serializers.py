from Board.models import *
from rest_framework import serializers

class BoardSerializer(serializers.ModelSerializer):
  class Meta:
    model = Board
    # fields = ['id', 'title', 'is_consultancy]
    fields = '__all__'
