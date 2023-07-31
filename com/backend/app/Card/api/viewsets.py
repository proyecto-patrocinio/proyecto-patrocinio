from Card.api.serializers import CardSerializer, CardCreateSerializer
from Card.models import Card
from rest_framework import viewsets
# list, create, retrieve, update, partial_update, destroy


class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()  # all the data in the table
    serializer_class = CardSerializer

    def create(self, request, *args, **kwargs):
        self.serializer_class = CardCreateSerializer
        return super().create(request, *args, **kwargs)
