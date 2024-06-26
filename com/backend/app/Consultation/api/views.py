import json
import logging
from django.db import connection
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import timedelta
from datetime import datetime
from django.db.models import Q
from django.utils import timezone
from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from User.permissions import FormsGroupPermission

from Consultation.choices import REQUEST_STATES
from Board.models import Board
from Board.api.serializers import BoardSerializer
from Clients.models import Client
from Card.api.serializers import CardCreateSerializer
from Consultation.api.serializers import (
    ConsultationSerializer,
    ConsultationUpdateSerializer,
    ConsultationCreateSerializer,
    RequestConsultationSerializer,
    ConsultationAceptedSerializer,
    ConsultationRejectedSerializer,
)
from Consultation.models import Consultation,  RequestConsultation
from Panel.models import Panel
from User.permissions import CheckGroupPermission, ProfessorGroupPermission, CaseTakerGroupPermission
from email_manager.new_request_notification import send_email_new_request
from email_manager.rejected_request_notification import send_email_rejected_request
from email_manager.accepted_request_notification import send_email_accepted_request
from Notification.consummers import CONSULTANCY_GROUP_NAME, BOARD_BASE_GROUP_NAME, send_sync_group_message


logger = logging.getLogger(__name__)
create_locks = {}


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

    def partial_update(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        return super().destroy(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        return super().retrieve(request, *args, **kwargs)

    @action(detail=False, methods=['POST'])
    def form(self, request, *args, **kwargs):
        self.permission_classes = [FormsGroupPermission]
        consultation_json = request.data

        # Get ID client
        id_client = consultation_json['client'].upper()  # PASSPORT use Upper Case
        with transaction.atomic():
            client = Client.objects.filter(id_value=id_client).first()
            if not client:
                mns = f"Error: Consultant with ID value {id_client} not Found."
                logger.error(mns)
                return Response(mns, status=404)
            consultation_json["client"] = client.id

            serializer = ConsultationCreateSerializer(data=consultation_json)

            if serializer.is_valid():
                send_sync_group_message(CONSULTANCY_GROUP_NAME, "Se ha creado una nueva consulta a partir de un formulario.")
                serializer.save()
                return Response(serializer.data, status=201)
            else:
                return Response(serializer.errors, status=400)


    @action(detail=True, methods=['POST'])
    def clear(self, request, *args, **kwargs):
        """Limpia las solicitudes de consulta pendientes dejando la consulta en estado 'CREATED'."""
        self.permission_classes = [CaseTakerGroupPermission]
        consultation = self.get_object()
        try:
            with transaction.atomic():
                with connection.cursor() as cursor:
                    cursor.execute('SELECT * FROM  public."Consultation_consultation" WHERE id = %s FOR UPDATE', [consultation.id]) # LOCK from DB

                    pending_requests = RequestConsultation.objects.filter(consultation=consultation.id, state='PENDING')
                    for req in pending_requests:
                        req.delete()
                    consultation.availability_state = 'CREATED'
                    consultation.save()
            if pending_requests:
                message = 'Se eliminaron las solicitudes de consulta pendientes correctamente.'
            else:
                message = 'No hay solicitudes pendientes a eliminar para la consulta.'
            return Response(data={'message': message}, status=status.HTTP_200_OK)
        
        except Exception as e:
            # Manejar cualquier error
            message = f'Error al eliminar las solicitudes de consulta pendientes: {str(e)}'
            return Response(data={'error': message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['POST'])
    def accepted(self, request, *args, **kwargs):
        self.permission_classes = [ProfessorGroupPermission]
        self.serializer_class = ConsultationAceptedSerializer
        try:
            with transaction.atomic():
                # Get Consultation and Panel destiny
                destiny_panel_id = request.data.get('destiny_panel')
                consultation = self.get_object()
                if not destiny_panel_id:
                    mns = "Error aceptando la solicitud de consulta: el campo 'destiny_panel'es requerido."
                    logger.error(mns)
                    logger.debug(f"Request query params: {request.query_params}")
                    return Response(
                        data={'error': mns},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                request_consultation = RequestConsultation.objects.get(consultation=consultation.id, state='PENDING', resolution_timestamp=None)
                if not request_consultation:
                    mns = f"No hay solicitudes pendientes para la consulta '{consultation}'"
                    logger.error(mns)
                    return Response(
                        data={'error': mns},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                destiny_panel = Panel.objects.get(id=destiny_panel_id)
                if destiny_panel is None:
                    logger.error(f"Error accepting consultation {consultation}.")
                    logger.error(f"Panel Destity {destiny_panel_id} does not exist.")
                    return Response(
                        f"El panel de destino con ID '{destiny_panel_id}' no existe.",
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Create a new Card
                logger.info(f"Accepting consultation '{consultation}' for '{request_consultation.destiny_board}' board...")
                new_card ={
                    "consultation": consultation.id,
                    "panel": destiny_panel_id,
                    "tag": consultation.tag
                }
                card_serializer = CardCreateSerializer(data=new_card, many=False)
                if card_serializer.is_valid():
                    logger.info(f"Card {consultation.id} created successfully.")
                else:
                    logger.error(f"Error creating new card for consultation '{consultation}'.")
                    logger.debug(f"Serializer errors: {card_serializer.errors}")
                    return Response(card_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

                # Update request state
                request_consultation.state = 'ACCEPTED'
                logger.info(f"The request state has been updated to 'ACCEPTED' for request {request_consultation.pk}.")

                # Update Consultation state
                consultation.availability_state = "ASSIGNED"
                consultation.start_time = datetime.now()
                logger.info(f"Updated consultation '{consultation}' availability state to ASSIGNED.")

                # Save transaction
                request_consultation.save()
                card_serializer.save()
                consultation.save()

                destiny_board = request_consultation.destiny_board
                send_email_accepted_request(destiny_board, consultation)
                send_sync_group_message(
                    CONSULTANCY_GROUP_NAME,
                    f"La solicitud de consulta '{consultation.tag}' para el tablero '{destiny_board}' fue aceptada."
                )
                send_sync_group_message(
                    f"{BOARD_BASE_GROUP_NAME}{destiny_board.id}",
                    f"La solicitud de consulta '{consultation.tag}' para el tablero '{destiny_board}' fue aceptada."
                )
                return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            logger.error(f"Error accepting consultation '{consultation}'.")
            logger.debug(f"Exception: {e}")
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"error": str(e)})

    @action(detail=True, methods=['POST'])
    def archived(self, request, *args, **kwargs):
        self.permission_classes = [IsAuthenticated]
        self.serializer_class = ConsultationRejectedSerializer
        consultation = self.get_object()
        logger.info(f"Consultation '{consultation}' commision was archived...")
        try:
            consultation.availability_state = "ARCHIVED"
            consultation.save()
            logger.info(f"Updated consultation {consultation.id} availability state to ARCHIVED.")
            send_sync_group_message(
                CONSULTANCY_GROUP_NAME,
                f"La consulta '{consultation.tag}' fue archivada desde la consultoría."
            )
            return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            logger.error(f"Error archiving consultation {consultation.id}.")
            logger.debug(f"Exception: {e}")
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"error": str(e)})

    @action(detail=True, methods=['POST'])
    def rejected(self, request, *args, **kwargs):
        self.permission_classes = [IsAuthenticated]
        self.serializer_class = ConsultationRejectedSerializer
        consultation = self.get_object()
        request_consultation = RequestConsultation.objects.get(consultation=consultation.id, state='PENDING')
        if not request_consultation:
            logger.error(f"Error in rejecting consultation: Pending request consultation does not exist for consultation '{consultation}'.")
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data=f"No existe una solicitud pendiente para la consulta '{consultation}'")
        destiny_board = request_consultation.destiny_board
        logger.info(f"Rejecting consultation '{consultation}' for '{destiny_board}' commision...")
        try:
            with transaction.atomic():
                # Update request state
                request_consultation.state = 'REJECTED'
                request_consultation.save()
                logger.info(f"The request state has been updated to 'REJECTED' for request {request_consultation.pk}.")

                # Update Consultation State
                consultation.availability_state = "REJECTED"
                consultation.save()
                logger.info(f"Updated consultation {consultation.id} availability state to REJECTED.")

                send_email_rejected_request(destiny_board, consultation)
                send_sync_group_message(
                    CONSULTANCY_GROUP_NAME,
                    f"La solicitud de consulta '{consultation.tag}' para el tablero '{destiny_board}' fue rechazada."
                )
                send_sync_group_message(
                    f"{BOARD_BASE_GROUP_NAME}{destiny_board.id}",
                    f"La solicitud de consulta '{consultation.tag}' para el tablero '{destiny_board}' fue rechazada."
                )
                return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            logger.error(f"Error rejecting consultation {consultation.id}.")
            logger.debug(f"Exception: {e}")
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={"error": str(e)})


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
        consultation_id = request.data.get("consultation")
        # Get content from Body

        if not (consultation_id):
            logger.error('Error creating request: ', 'The key "consultation" is not present in the JSON.')
            return Response(data={'error': 'El campo "consultation" es obligatorio.'}, status=400)

        # Check if Consultation exists
        try:
            consultation = Consultation.objects.get(id=consultation_id)
        except Consultation.DoesNotExist:
            mns = f'Consultation not found with ID {consultation_id}.'
            logger.error('Error creating request: ' + mns)
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': mns})

        with transaction.atomic(using=RequestConsultation.objects.db):
            with connection.cursor() as cursor:
                cursor.execute('SELECT * FROM  public."Consultation_consultation" WHERE id = %s FOR UPDATE', [consultation_id]) # LOCK from DB

                # Check if Consultation is not already assigned or has pending requests
                if consultation.availability_state not in ["CREATED", "REJECTED", "PENDING"]:
                    mns = f'La consulta {consultation_id} ya está asignada o rechazada'
                    logger.error(mns)
                    return Response(status=status.HTTP_409_CONFLICT, data={'error': mns})

                # Check if there is already a pending request for the consultation
                RequestConsultation.objects.filter(consultation=consultation, state='PENDING').delete()

                # Create a new Request Consultation
                response = super().create(request, *args, **kwargs)

                if response.status_code == 201:
                    consultation.availability_state = "PENDING"
                    consultation.save()
                    logger.info(f"Consultation {consultation_id} created.")
                else:
                    logger.error(f"Error creating consultation with ID {consultation_id}.")
                    logger.debug(f"Response: {response.data}")

        if response.status_code == 201:
            destiny_board_id = request.data.get("destiny_board")
            board = Board.objects.get(id=destiny_board_id)

            send_email_new_request(board)
            send_sync_group_message(
                f"{BOARD_BASE_GROUP_NAME}{destiny_board_id}",
                f"La solicitud de consulta '{consultation.tag}' fue creada para el tablero '{board}' exitosamente."
            )
            send_sync_group_message(
                CONSULTANCY_GROUP_NAME,
                f"La solicitud de consulta '{consultation.tag}' fue creada para el tablero '{board}'."
            )
        return response

    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        """Delete a Consultation and update its availability_state to "CREATED".

        This method handles the deletion of a Consultation instance and,
        updates its availability_state to "CREATED" to indicate the cancellation of the request.
        """
        self.permission_classes = [CheckGroupPermission]

        consultation = self.get_object().consultation
        destiny_board = self.get_object().destiny_board

        response = super().destroy(request, *args, **kwargs)

        if response.status_code == 204:
            consultation = Consultation.objects.get(id=consultation.id)
            consultation.availability_state = "CREATED"
            consultation.save()
            logger.info(f"Request Consultation {consultation.id} deleted.")

            send_sync_group_message(
                f"{BOARD_BASE_GROUP_NAME}{destiny_board.id}",
                f"La solicitud de consulta '{consultation.tag}' para el tablero '{destiny_board}' fue eliminada."
            )
        else:
            logger.error(f"Error deleting consultation with ID {consultation.id}.")
            logger.debug(f"Response: {response.data}")

        return response

    def list(self, request, *args, **kwargs):
        """Custom list view that handles special group-board filtering (for pending request).

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
