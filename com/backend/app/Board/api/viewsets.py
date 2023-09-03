from requests import Response
from rest_framework import viewsets
from Board.api.serializers import BoardSerializer, BoardFullSerializer, BoardListSerializer, ConsultancyListSerializer
from Board.models import Board
from django.db.models import Prefetch, Count
from rest_framework.decorators import action

from Consultation.models import Consultation

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
        self.queryset = self.queryset.prefetch_related(
            'request_consultations'
        )
        return super().retrieve(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        self.queryset = Board.objects.annotate(
            number_cards=Count('panels__cards', distinct=True)
        )
        self.serializer_class = BoardListSerializer
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def consultancy_board(self, request, *args, **kwargs):
        """Custom action to retrieve consultancy data for boards."""
        self.queryset = Board.objects.prefetch_related(
            Prefetch('request_consultations', to_attr='cards')
        ).annotate(
            number_cards=Count('panels__cards', distinct=True)
        )
        self.serializer_class = ConsultancyListSerializer
        consultancy_data = super().list(request, *args, **kwargs)
        return self.add_tag_to_consultations(consultancy_data)

    def add_tag_to_consultations(self, consultancy_data: Response) -> Response:
        """Add tags to consultancy data.

        Args:
            consultancy_data (Response): The consultancy data response.

        Returns:
            Response: The response with added tags to consultations.
        """
        for panel in consultancy_data.data:
            for request_consultation in panel["cards"]:
                request_consultation["tag"] = Consultation.objects.get(id=request_consultation["consultation"]).tag
        return consultancy_data
