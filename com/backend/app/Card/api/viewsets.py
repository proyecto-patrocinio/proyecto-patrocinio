from Card.api.serializers import CardSerializer, CardCreateSerializer
from Card.models import Card
from rest_framework import viewsets
from django.db.models import Count
from User.permissions import CheckGroupPermission
from Notification.consummers import send_sync_group_message, BOARD_BASE_GROUP_NAME


class CardViewSet(viewsets.ModelViewSet):
    """API endpoint that allows CRUD operations on Card objects."""
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [CheckGroupPermission]

    def create(self, request, *args, **kwargs):
        """Custom create view that uses a different serializer for card creation.

        Overrides the default serializer class to use CardCreateSerializer for creating cards.
        """
        self.serializer_class = CardCreateSerializer
        return super().create(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        destiny_panel = request.data["panel"]
        if destiny_panel:
            # Move card to other panel in the same board.
            send_sync_group_message(
                f"{BOARD_BASE_GROUP_NAME}{self.get_object().panel.board.id}",
                f"Se han producido cambios en la tarjeta '{self.get_object().tag}'."
            )
        return super().partial_update(request, *args, **kwargs)
