from Card.api.serializers import CardSerializer
from Card.models import Card
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
# list, create, retrieve, update, partial_update, destroy

class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()  # all the data in the table
    serializer_class = CardSerializer
    permission_classes = [ AllowAny  ] # only authenticated users can access
    permission_classes = [ IsAuthenticated  ]


    def list(self, request):
        # Obtener todas las provincias y serializarlas
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


