from rest_framework import viewsets
from Board.api.serializers import BoardSerializer, BoardFullSerializer, BoardListSerializer
from Board.models import Board
from django.db.models import Prefetch, Sum, Count

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

  def list(self, request, *args, **kwargs):
        self.queryset = Board.objects.prefetch_related(
            Prefetch('boardusers')
        ).annotate(
            number_cards=Count('panels__cards', distinct=True)
        )
        self.serializer_class = BoardListSerializer
        return super().list(request, *args, **kwargs)