from rest_framework import viewsets
from Board.api.serializers import BoardSerializer, BoardFullSerializer
from Board.models import Board
from rest_framework import viewsets
from django.db.models import Prefetch

class BoardViewSet(viewsets.ModelViewSet):
  queryset = Board.objects.all()
  serializer_class = BoardSerializer

  def retrieve(self, request, *args, **kwargs):
        self.serializer_class = BoardFullSerializer
        self.queryset = self.queryset.prefetch_related( 
                        Prefetch('boardusers')
        )
        self.queryset = self.queryset.prefetch_related( 
                        'panels__cards'
        )
        return super().retrieve(request, *args, **kwargs)