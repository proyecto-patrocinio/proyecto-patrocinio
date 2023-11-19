import os

from django.db.models import F, Q
from django.db.models import Prefetch, Count
from django.utils import timezone
from datetime import timedelta
from datetime import datetime
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, viewsets

from Board.api.serializers import BoardSerializer, BoardFullSerializer, BoardListSerializer, ConsultancyListSerializer
from Board.models import Board
from Card.models import Card
from Card.api.serializers import CardLogSerializer
from constants import CONSULTANCY_BOARD_NAME
from Consultation.models import Consultation
from User.permissions import CheckGroupPermission

class BoardViewSet(viewsets.ModelViewSet):
    """View set for managing board-related operations.

    Methods:
        retrieve: Retrieve details for a specific board.
        list: List all boards with the count of associated cards.
        consultancy_board: Retrieve consultancy data, including associated request cards, for boards.
        logs: Retrieve cards for a specific board that started N days ago.
    """
    queryset = Board.objects.all()
    serializer_class = BoardSerializer
    permission_classes = [CheckGroupPermission]

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

        self.queryset = Board.objects.annotate(
            number_cards=Count('panels__cards', distinct=True),
            todo_count=Count('panels__cards__consultation', filter=Q(panels__cards__consultation__progress_state='TODO')),
            in_progress_count=Count('panels__cards__consultation', filter=Q(panels__cards__consultation__progress_state='IN_PROGRESS')),
            done_count=Count('panels__cards__consultation', filter=Q(panels__cards__consultation__progress_state='DONE')),
            paused_count=Count('panels__cards__consultation', filter=Q(panels__cards__consultation__progress_state='PAUSED')),
            blocked_count=Count('panels__cards__consultation', filter=Q(panels__cards__consultation__progress_state='BLOCKED')),
            incomplete_count=Count('panels__cards__consultation', filter=Q(panels__cards__consultation__progress_state='INCOMPLETE')),
        ).prefetch_related(
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

    @action(detail=True, methods=['GET'])
    def logs(self, request, *args, **kwargs):
        """Retrieve cards for a specific board that started N days ago.

        Requires 'days' parameter in the query string specifying the number of days.
        Example: 'GET api/boards/board/1/logs/?days=7'
        """
        days_ago = request.query_params.get('days')
        board_id = self.get_object().pk

        if not days_ago:
            return Response({'error': 'Parameter "days" is required.'},  status=status.HTTP_400_BAD_REQUEST)

        try:
            days_ago = int(days_ago)
        except ValueError:
            return Response({'error': 'Invalid value for parameter "days".'}, status=status.HTTP_400_BAD_REQUEST)

        start_date = datetime.now() - timedelta(days=days_ago)

        # Filter cards based on start_time and board_id
        logs_cards = Card.objects.filter(
            panel__board_id=board_id,
            consultation__start_time__gte=start_date
        ).all()

        serializer = CardLogSerializer(logs_cards, many=True)
        return Response(data=serializer.data,  status=status.HTTP_200_OK)
