from rest_framework import viewsets
from Consultation.api.serializers import (
    ConsultationSerializer,
    RequestConsultationSerializer,
)
from Consultation.models import Consultation,  RequestConsultation
from rest_framework.response import Response
from Board.models import Board
from Board.api.serializers import BoardSerializer
from django.db.models import Prefetch, Sum, Count

class ConsultationViewSet(viewsets.ModelViewSet):
    """API endpoint that allows CRUD operations on Consultation objects."""
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer

    def list(self, request, *args, **kwargs):
        """Custom list view that handles filtering based on the 'state' query parameter.

        If 'state' parameter is present in the request's GET parameters, it filters
        the queryset to include only consultations with the specified state. Then, it
        calls the parent class's list method to handle standard listing.
        """
        state_filter = self.request.query_params.get('state')
        if state_filter:
            self.queryset = Consultation.objects.filter(state=state_filter)
        return super().list(request, *args, **kwargs)


class RequestConsultationViewSet(viewsets.ModelViewSet):
    """API endpoint that allows CRUD operations on RequestConsultation objects."""
    queryset = RequestConsultation.objects.all()
    serializer_class = RequestConsultationSerializer

    def list(self, request, *args, **kwargs):
        """Custom list view that handles special group-board filtering.

        If 'group_by' parameter is in the request's GET parameters, it performs
        filtering based on the group-board query parameter. If 'group_by' is set
        to 'board', it returns a dictionary grouping requests by destiny board.
        Otherwise, it calls the parent class's list method to handle standard listing.
        """
        if 'group_by' in request.GET:
            filter_string = request.GET['group_by']
            if filter_string == 'board':
                request_consultations = RequestConsultation.objects.all()
                serializer = RequestConsultationSerializer(
                    request_consultations, many=True
                )
                request_consultations_data = serializer.data
                request_group_board_dict = {}
                query_boards = Board.objects.all()
                board_list = BoardSerializer(query_boards, many=True).data
                for board in board_list:
                    request_group_board_dict[board['id']] = []
                for request in request_consultations_data:
                    board = request['destiny_board']
                    request_group_board_dict[board].append(request)
                return Response(request_group_board_dict)
        return super().list(request, *args, **kwargs)
