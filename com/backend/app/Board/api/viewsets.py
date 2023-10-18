import os
from rest_framework import viewsets
from Board.api.serializers import BoardSerializer, BoardFullSerializer, BoardListSerializer, ConsultancyListSerializer
from Board.models import Board
from django.db.models import Prefetch, Count
from rest_framework.decorators import action
from constants import CONSULTANCY_BOARD_NAME
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
        board = super().retrieve(request, *args, **kwargs)

        # Add tag to requests
        request_list = board.data["request_consultations"]
        for request_consultation in request_list:
            request_consultation["tag"] = Consultation.objects.get(id=request_consultation["consultation"]).tag
        board.data["request_consultations"] = request_list

        return board

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
        consultancy = super().list(request, *args, **kwargs)
        consultancy_panels = consultancy.data
        consultancy_data = {
            "id": 0,
            "title": CONSULTANCY_BOARD_NAME,
            "panels": consultancy_panels
        }
        consultancy.data = consultancy_data

        # Add tag to requests consultancies
        for panel in consultancy.data["panels"]:
            for request_consultation in panel["cards"]:
                request_consultation["tag"] = Consultation.objects.get(id=request_consultation["consultation"]).tag

        return consultancy
