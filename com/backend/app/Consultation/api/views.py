from rest_framework import viewsets
from Consultation.api.serializers import (
    ConsultationSerializer,
    RequestConsultationSerializer,
)
from Consultation.models import Consultation,  RequestConsultation
from rest_framework.response import Response


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
        """Custom list view that handles special cross-board filtering.

        If 'cross' parameter is in the request's GET parameters, it performs
        filtering based on the cross-board query parameter. If 'cross' is set
        to 'all_boards', it returns a dictionary grouping requests by destiny board.
        Otherwise, it calls the parent class's list method to handle standard listing.
        """
        if 'cross' in request.GET:
            filter_string = request.GET['cross']
            if filter_string == "all_boards":
                request_consultations = RequestConsultation.objects.all()
                serializer = RequestConsultationSerializer(
                    request_consultations, many=True
                )
                request_consultations_data = serializer.data
                request_cross_board_dict = {}
                for request in request_consultations_data:
                    board = request['destiny_board']
                    if board in request_cross_board_dict:
                        request_cross_board_dict[board].append(request)
                    else:
                        request_cross_board_dict[board] = [request]
                return Response(request_cross_board_dict)
        return super().list(request, *args, **kwargs)
