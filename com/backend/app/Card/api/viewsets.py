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
    permission_classes = [ IsAuthenticated ]



