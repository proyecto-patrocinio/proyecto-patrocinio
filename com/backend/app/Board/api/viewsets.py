from rest_framework import viewsets
from Board.api.serializers import BoardSerializer
from Board.models import Board
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

class BoardViewSet(viewsets.ModelViewSet):
  queryset = Board.objects.all()  # all the data in the table
  serializer_class = BoardSerializer
  permission_classes = [ IsAuthenticated ] # only authenticated users can access

  def list(self, request):
        # Obtener todas las provincias y serializarlas
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)