import json
import logging

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta
from datetime import datetime
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny

from Board.models import Board
from Board.api.serializers import BoardSerializer
from Clients.models import Client
from Card.api.serializers import CardCreateSerializer
from Consultation.api.serializers import (
    ConsultationSerializer,
    ConsultationUpdateSerializer,
    ConsultationCreateSerializer,
    RequestConsultationSerializer,
    RequestConsultationAceptedSerializer,
    RequestConsultationRejectedSerializer,
)
from Consultation.models import Consultation,  RequestConsultation
from Panel.models import Panel
from User.permissions import CheckGroupPermission, ProfessorGroupPermission
from email_manager.new_request_notification import send_email_new_request
from email_manager.rejected_request_notification import send_email_rejected_request
from email_manager.accepted_request_notification import send_email_accepted_request

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.setLevel(logging.DEBUG)


class ConsultationViewSet(viewsets.ModelViewSet):
    """API endpoint that allows CRUD operations on Consultation objects."""
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer

    def create(self, request, *args, **kwargs):
        """Custom create view that uses the ConsultationCreateSerializer."""
        self.permission_classes = [CheckGroupPermission]
        self.serializer_class = ConsultationCreateSerializer
        return super().create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        """Custom list view that handles filtering based on the 'availability_state' query parameter.

        If 'availability_state' parameter is present in the request's GET parameters, it filters
        the queryset to include consultations based on the specified state(s) using AND or OR.
        Then, it calls the parent class's list method to handle standard listing.

        Example:
            'GET /consultations/?availability_state=REJECTED,PENDING'
        """
        self.permission_classes = [CheckGroupPermission]
        state_filter = self.request.query_params.get('availability_state')
        if state_filter:
            state_list = state_filter.split(',')
            filter_query = Q()
            
            for availability_state in state_list:
                filter_query |= Q(availability_state=availability_state)

            self.queryset = Consultation.objects.filter(filter_query)

        return super().list(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        self.serializer_class = ConsultationUpdateSerializer
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        return super().destroy(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        return super().retrieve(request, *args, **kwargs)

    @action(detail=False, methods=['POST'])
    def form(self, request, *args, **kwargs):
        self.permission_classes = [AllowAny]
        consultation_json = request.data

        # Get ID client
        id_client = consultation_json['client']
        client = Client.objects.filter(id_value=id_client).first()
        if not client:
            return Response(f"Error: Consultant with ID value {id_client} not Found.", status=404)
        consultation_json["client"] = client.id

        serializer = ConsultationCreateSerializer(data=consultation_json)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)


class RequestConsultationViewSet(viewsets.ModelViewSet):
    """API endpoint that allows CRUD operations on RequestConsultation objects."""
    queryset = RequestConsultation.objects.all()
    serializer_class = RequestConsultationSerializer

    def create(self, request, *args, **kwargs):
        """Create a new Consultation and set its availability_state to "PENDING" if it meets the conditions.

        This method handles the creation of a new Consultation instance, updating its availability_state to "PENDING"
        if it's eligible. It performs checks to ensure that the Consultation doesn't already exist
        or have pending requests.
        """
        self.permission_classes = [CheckGroupPermission]

        # Get content from Body
        consultation_id = request.data.get("consultation")
        if not (consultation_id):
            mns = 'The key "consultation" is not present in the JSON.'
            logger.error('Error creating request: ', mns)
            return Response(data={'error': mns}, status=400)

        # Check if Consultation exists
        try:
            consultation = Consultation.objects.get(id=consultation_id)
        except Consultation.DoesNotExist:
            mns = f'Consultation not found with ID {consultation_id}.'
            logger.error('Error creating request: ' + mns)
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': mns})

        # Check if Consultation is not already assigned or has pending requests
        is_created = consultation.availability_state == "CREATED"
        is_rejected = consultation.availability_state == "REJECTED"
        is_incomplete = consultation.availability_state == "INCOMPLETE"
        if (not is_created) and (not is_rejected) and (not is_incomplete):
            mns = f'Consultation {consultation_id} is already assigned or there exists a pending request'
            logger.error(mns)
            return Response(status=status.HTTP_409_CONFLICT, data={'error': mns})

        # Create a new Request Consultation
        response = super().create(request, *args, **kwargs)

        if response.status_code == 201:
            consultation.availability_state = "PENDING"
            consultation.save()
            logger.info(f"Consultation {consultation_id} created.")
            destiny_board = request.data.get("destiny_board")
            send_email_new_request(destiny_board)
        else:
            logger.error(f"Error creating consultation with ID {consultation_id}.")
            logger.debug(f"Response: {response.data}")

        return response

    def destroy(self, request, *args, **kwargs):
        """Delete a Consultation and update its availability_state to "CREATED".

        This method handles the deletion of a Consultation instance and,
        updates its availability_state to "CREATED" to indicate the cancellation of the request.
        """
        self.permission_classes = [CheckGroupPermission]

        consultation_id = self.get_object().pk  # RequestConsultation.consultation is the pk

        response = super().destroy(request, *args, **kwargs)

        if response.status_code == 204:
            consultation = Consultation.objects.get(id=consultation_id)
            consultation.availability_state = "CREATED"
            consultation.save()
            logger.info(f"Request Consultation {consultation_id} deleted.")
        else:
            logger.error(f"Error deleting consultation with ID {consultation_id}.")
            logger.debug(f"Response: {response.data}")

        return response

    def list(self, request, *args, **kwargs):
        """Custom list view that handles special group-board filtering.

        If 'group_by' parameter is in the request's GET parameters, it performs
        filtering based on the group-board query parameter. If 'group_by' is set
        to 'board', it returns a dictionary grouping requests by destiny board.
        Otherwise, it calls the parent class's list method to handle standard listing.
        """
        self.permission_classes = [CheckGroupPermission]

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

    @action(detail=True, methods=['POST'])
    def accepted(self, request, *args, **kwargs):
        self.permission_classes = [ProfessorGroupPermission]
        self.serializer_class = RequestConsultationAceptedSerializer
        consultation_id = self.get_object().pk  # RequestConsultation.consultation is the pk
        destiny_board = self.get_object().destiny_board
        logger.info(f"Accepting consultation '{consultation_id}' for '{destiny_board}' commision...")
        try:
            # Get Consultation and Panel destiny
            consultation = Consultation.objects.get(id=consultation_id)
            destiny_panel_id = request.data.get('destiny_panel')
            if destiny_panel_id is None or destiny_panel_id == 0:
                logger.error(f"Error accepting consultation {consultation_id}.")
                logger.error("Missing 'destiny_panel' query parameter.")
                logger.debug(f"Request query params: {request.query_params}")
                return Response(
                    data={'error':"Missing 'destiny_panel' query parameter."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            destiny_panel = Panel.objects.get(id=destiny_panel_id)
            if destiny_panel is None:
                logger.error(f"Error accepting consultation {consultation_id}.")
                logger.error(f"Panel Denstity {destiny_panel_id} does not exist.")
                return Response(
                    f"Panel destiny {destiny_panel_id} does not exist.",
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create a new Card
            new_card ={
                "consultation": consultation_id,
                "panel": destiny_panel_id,
                "tag": consultation.tag
            }
            card_serializer = CardCreateSerializer(data=new_card, many=False)
            if card_serializer.is_valid():
                logger.info(f"Card {consultation_id} created successfully.")
            else:
                logger.error(f"Error creating new card for consultation {consultation_id}.")
                logger.debug(f"Serializer errors: {card_serializer.errors}")
                return Response(card_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Delete Request Consultation
            response = super().destroy(request, *args, **kwargs)
            if response.status_code == status.HTTP_204_NO_CONTENT:
                logger.info(f"Request Consultation {consultation_id} deleted.")
            else:
                logger.error(f"Error deleting request consultation {consultation_id}.")
                logger.debug(f"Response: {response.data}")
                card_serializer.delete()
                return Response(status=status.HTTP_400_BAD_REQUEST)

            # Update Consultation state
            consultation.availability_state = "ASSIGNED"
            consultation.start_time = datetime.now()
            logger.info(f"Updated consultation {consultation_id} availability state to ASSIGNED.")

            # Save transaction
            card_serializer.save()
            consultation.save()

            send_email_accepted_request(destiny_board, consultation)
            return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            logger.error(f"Error accepting consultation {consultation_id}.")
            logger.debug(f"Exception: {e}")
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": str(e)})


    @action(detail=True, methods=['POST'])
    def rejected(self, request, *args, **kwargs):
        self.permission_classes = [IsAuthenticated]
        self.serializer_class = RequestConsultationRejectedSerializer
        consultation_id = self.get_object().pk  # RequestConsultation.consultation is the pk
        destiny_board = self.get_object().destiny_board
        logger.info(f"Rejecting consultation '{consultation_id}' for '{destiny_board}' commision...")
        try:
            # Get Consultation and Panel destiny
            consultation = Consultation.objects.get(id=consultation_id)

            # Delete Request Consultation
            response = super().destroy(request, *args, **kwargs)
            if response.status_code == status.HTTP_204_NO_CONTENT:
                logger.info(f"Request Consultation {consultation_id} deleted.")
            else:
                logger.error(f"Error deleting request consultation {consultation_id}.")
                logger.debug(f"Response: {response.data}")
                return Response(status=status.HTTP_400_BAD_REQUEST)

            # Update Consultation State
            consultation.availability_state = "REJECTED"
            consultation.save()
            logger.info(f"Updated consultation {consultation_id} availability state to REJECTED.")
            send_email_rejected_request(destiny_board, consultation)
            return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            logger.error(f"Error rejecting consultation {consultation_id}.")
            logger.debug(f"Exception: {e}")
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": str(e)})
