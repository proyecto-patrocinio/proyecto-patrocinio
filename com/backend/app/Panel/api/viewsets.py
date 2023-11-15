import logging
from rest_framework.viewsets import ModelViewSet
from Panel.models import Panel
from Panel.api.serializers import (
    PanelSerializer,
    PanelFullSerializer,
    PanelWithNumberCardsSerializer
)
from rest_framework.response import Response
from django.db.models import Prefetch, Count
from rest_framework import status
from rest_framework.decorators import action


logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class PanelViewSet(ModelViewSet):
    queryset = Panel.objects.all()
    serializer_class = PanelSerializer

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a specific panel and its associated cards.

        Args:
            request: The HTTP request object.
            args: Additional positional arguments.
            kwargs: Additional keyword arguments.

        Returns:
            An HTTP response that includes the panel and its associated cards.
        """
        self.serializer_class = PanelFullSerializer
        self.queryset = self.queryset.prefetch_related(
                        Prefetch('cards')
        )
        return super().retrieve(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        """
        List all panels with the number of associated cards.

        Args:
            request: The HTTP request object.
            args: Additional positional arguments.
            kwargs: Additional keyword arguments.

        Returns:
            An HTTP response that includes the list of panels with the number of associated cards.
        """
        self.queryset = Panel.objects.prefetch_related(
            Prefetch('cards')
        ).annotate(
            number_cards=Count('cards', distinct=True)
        )
        self.serializer_class = PanelWithNumberCardsSerializer
        return super().list(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """
        Delete a panel if it has no associated cards; otherwise, return an error.

        Args:
            request: The HTTP request object.
            args: Additional positional arguments.
            kwargs: Additional keyword arguments.

        Returns:
            An HTTP response indicating whether the panel was deleted or if there was a conflict due to associated cards.
        """
        queryset = Panel.objects.prefetch_related(
            Prefetch('cards')
        ).annotate(
            number_cards=Count('cards', distinct=True)
        ).filter(id=self.get_object().pk)
        serializer = PanelWithNumberCardsSerializer
        response = serializer(queryset, many=True)

        if response.data == [] :
            logger.error('Panel not found')
            return Response(
                data={"message": "Panel not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        panel = response.data[0]
        if panel["number_cards"] == 0:
            logger.info('No cards associated with panel, deleting panel..')
            response = super().destroy(request, *args, **kwargs)

            if response.status_code < 400 :
                message = "Panel deleted successfully"
                status_code = 200
                logger.info(message)
            else:
                logger.error('Unexpected error, status code: %d', response.status_code)
                status_code = response.status_code

            response = Response(
                data={"message": message},
                status=status_code
            )
            return response

        else:
            logger.error('Panel has cards assigned and cannot be deleted')
            return Response(
                data={"message": "Panel has cards assigned and cannot be deleted"},
                status=status.HTTP_409_CONFLICT
            )

    @action(detail=True, methods=['delete'], url_name='force-destroy', url_path='force-destroy')
    def force_destroy(self, request, *args, **kwargs):
        """
        Forcefully delete a panel, even if it has cards assigned.

        Args:
            request: The HTTP request object.
            args: Additional positional arguments.
            kwargs: Additional keyword arguments.

        Returns:
            An HTTP response indicating whether the panel was deleted.
        """
        return super().destroy(request, *args, **kwargs)
