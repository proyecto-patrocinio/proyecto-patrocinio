from Card.api.serializers import CardSerializer, CardCreateSerializer
from Card.models import Card
from rest_framework import viewsets
from django.db.models import Count
# list, create, retrieve, update, partial_update, destroy


class CardViewSet(viewsets.ModelViewSet):
    """API endpoint that allows CRUD operations on Card objects."""
    queryset = Card.objects.all()
    serializer_class = CardSerializer

    def create(self, request, *args, **kwargs):
        """Custom create view that uses a different serializer for card creation.

        Overrides the default serializer class to use CardCreateSerializer for creating cards.
        """
        self.serializer_class = CardCreateSerializer
        return super().create(request, *args, **kwargs)
