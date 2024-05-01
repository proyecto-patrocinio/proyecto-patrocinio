import json
import logging
from django.http import QueryDict
from rest_framework import status

from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction

from Clients.api.serializers import *
from Clients.models import *
from rest_framework import viewsets
from django.db.models import Prefetch
from User.permissions import CheckGroupPermission, FormsGroupPermission
from Notification.consummers import send_sync_group_message, CONSULTANCY_GROUP_NAME


logger = logging.getLogger(__name__)

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

    def create(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        if isinstance(request.data, QueryDict):
            request.data._mutable = True
        request.data['id_value'] = request.data['id_value'].upper()  # PASSPORT use Upper Case.
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['POST'])
    @transaction.atomic
    def create_family(self, request, *args, **kwargs):
        try:
            children = request.data.get('children', None)
            data = {"children": []}
            if children:
                for child in children:
                    child["client_user"] = self.get_object()
                    child["locality"] = Locality.objects.get(pk=child["locality"]["id"])
                    del child["id"]
                    new_child = Child.objects.create(**child).id
                    data["children"].append(new_child)
            return Response(status=status.HTTP_201_CREATED, data=data)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"children": [], "error": f"No se pudo crear los hijos. Detalle: {str(e)}"})


    def list(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        self.serializer_class = ClientFullSerializer
        self.queryset = self.queryset.prefetch_related(
            Prefetch('locality')
        )
        self.queryset = self.queryset.prefetch_related(
            Prefetch('tels')
        )
        self.queryset = self.queryset.prefetch_related(
            Prefetch('children')
        )
        client_list = super().list(request, *args, **kwargs)
        for client in client_list.data:
            client["nationality"] = {'id': client["locality"]["province"]["nationality"]["id"],
                                    'name': client["locality"]["province"]["nationality"]["name"]}
            client["province"] = {'id': client["locality"]["province"]["id"], 'name': client["locality"]["province"]["name"]}
            client["locality"] = {'id': client["locality"]["id"], 'name': client["locality"]["name"]}
        return client_list

    def retrieve(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        self.serializer_class = ClientFullSerializer
        self.queryset = self.queryset.prefetch_related(
            Prefetch('tels')
        )
        self.queryset = self.queryset.prefetch_related(
            Prefetch('children')
        )
        return super().retrieve(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        self.serializer_class = ClientDestroySerializer
        return super().destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        return super().update(request, *args, **kwargs)


    @action(detail=False, methods=['POST'])
    def form(self, request, *args, **kwargs):
        self.permission_classes = [FormsGroupPermission]
        try:
            with transaction.atomic():
                serializer = ClientSerializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                client = serializer.save()


                tel_data = [{'client': client.id, 'phone_number': tel} for tel in request.data['tel']]
                tel_serializer = TelSerializer(data=tel_data, many=True)
                tel_serializer.is_valid(raise_exception=True)
                tels = tel_serializer.save()

        except Locality.DoesNotExist:
            mns = f"Failed to load client data from the form: Locality not found"
            logger.error(mns)
            return Response(mns, status=400)
        except Exception as e:
            mns = f"Failed to load client data from the form: {str(e)}"
            logger.error(mns)
            return Response(mns, status=400)

        send_sync_group_message(CONSULTANCY_GROUP_NAME, "Se ha creado un nuevo cliente a partir del formulario.")
        return Response("Success: Data processed successfully.", status=200)



class childViewSet(viewsets.ModelViewSet):
    queryset = Child.objects.all()
    serializer_class = ChildSerializer

    def create(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        self.serializer_class = ChildCreateSerializer
        return super().create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        return super().list(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        return super().destroy(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=['POST'])
    def form(self, request, *args, **kwargs):
        self.permission_classes = [FormsGroupPermission]
        try:
            child_json = request.data

            # Get ID family
            id_client = child_json['id_consultant']
            with transaction.atomic():
                client = Client.objects.filter(id_value=id_client).first()
                if not client:
                    return Response(f"Error: Consultant with ID value {id_client} not Found.", status=404)
                child_json["client_user"] = client.id

                serializer = ChildCreateSerializer(data=child_json)

                if serializer.is_valid():
                    serializer.save()
                    send_sync_group_message(CONSULTANCY_GROUP_NAME, f"A new child was registered for a Client {client} with ID {client.id}.")
                    return Response(serializer.data, status=201)
                else:
                    return Response(serializer.errors, status=400)
        except Exception as e:
            mns = f"Failed to load Child data from the form: {str(e)}"
            logger.error(mns)
            return Response(mns, status=400)

class TelViewSet(viewsets.ModelViewSet):
    queryset = Tel.objects.all()
    serializer_class = TelSerializer
    permission_classes = [CheckGroupPermission]
