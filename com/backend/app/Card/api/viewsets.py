from Card.api.serializers import CardSerializer, CardCreateSerializer
from Card.models import Card
from rest_framework import viewsets
# list, create, retrieve, update, partial_update, destroy


class CardViewSet(viewsets.ModelViewSet):
    """API endpoint that allows CRUD operations on Card objects.

    Inherits from viewsets.ModelViewSet and provides additional functionality
    for custom handling of 'create' and filtering based on the 'state' query parameter.
    """
    queryset = Card.objects.all()  # all the data in the table
    serializer_class = CardSerializer

    def create(self, request, *args, **kwargs):
        """Custom create view that uses a different serializer for card creation.

        Overrides the default serializer class to use CardCreateSerializer for creating cards.
        """
        self.serializer_class = CardCreateSerializer
        return super().create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        """Custom list view that handles filtering based on the 'state' query parameter.

        If 'state' parameter is present in the request's GET parameters, it filters
        the queryset to include only cards with the specified state. Then, it calls
        the parent class's list method to handle standard listing.
        """
        state_filter = self.request.query_params.get('state')
        if state_filter:
            self.queryset = Card.objects.filter(state=state_filter)
        return super().list(request, *args, **kwargs)
