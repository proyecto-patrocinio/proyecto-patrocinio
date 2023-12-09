import json
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from Clients.api.serializers import *
from Clients.models import *
from rest_framework import viewsets
from django.db.models import Prefetch
from User.permissions import CheckGroupPermission
from Notification.consummers import send_sync_group_message, CONSULTANCY_GROUP_NAME


class PatrimonyViewSet(viewsets.ModelViewSet):
    queryset = Patrimony.objects.all()
    serializer_class = PatrimonySerializer


class FamilyViewSet(viewsets.ModelViewSet):
    queryset = Family.objects.all()
    serializer_class = FamilySerializer
    permission_classes = [CheckGroupPermission]

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = FamilyFullSerializer
        self.queryset = self.queryset = self.queryset.prefetch_related(
            Prefetch('children__locality')
        )
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        family = super().create(request, *args, **kwargs)
        children = request.data.get('children', None)
        family.data["children"] = []
        if children:
            for child in children:
                child["family_client_user"] = Family.objects.get(pk=family.data["id"])
                child["locality"] = Locality.objects.get(pk=child["locality"]["id"])
                del child["id"]
                new_child = Son.objects.create(**child).id
                family.data["children"].append(new_child)
        return family

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

    def create(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        return super().create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        self.serializer_class = ClientFullSerializer
        self.queryset = self.queryset.prefetch_related(
            Prefetch('locality')
        )
        self.queryset = self.queryset.prefetch_related(
            Prefetch('patrimony')
        )
        self.queryset = self.queryset.prefetch_related(
            Prefetch('tels')
        )
        self.queryset = self.queryset.prefetch_related(
            'family__children'
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
            Prefetch('patrimony')
        )
        self.queryset = self.queryset.prefetch_related(
            Prefetch('tels')
        )
        self.queryset = self.queryset.prefetch_related(
            'family__children'
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
        try:
            client = patrimony = family = None
            tels = []
            data_body = request.data

            # Get data
            partner_salary = data_body['partner_salary']
            tel_list = data_body['tel']
            patrimony_keys = ('employment', 'salary', 'other_income', 'amount_other_income', 'amount_retirement', 'amount_pension', 'vehicle')
            patrimony_json = {k: v for k, v in data_body.items() if k in patrimony_keys}
            client_keys = ('locality', 'first_name', 'last_name', 'id_type', 'id_value', 'sex', 'birth_date', 'address', 'postal', 'marital_status', 'housing_type', 'studies', 'email')
            client_json = {k: v for k, v in data_body.items() if k in client_keys}
            client_json['locality'] = Locality.objects.get(pk=client_json['locality'])

            # Create Objects
            client = Client.objects.create(**client_json)
            patrimony = Patrimony.objects.create(id=client, **patrimony_json)
            family = Family.objects.create(id=client, partner_salary=partner_salary)
            for tel in tel_list:
                tels.append(Tel.objects.create(client=client,phone_number=tel))

        except Locality.DoesNotExist:
            return Response("Error: Locality not found", status=400)
        except Exception as e:
            for obj in [client, patrimony, family] + tels:
                if obj and obj.id:
                    obj.delete()
            return Response(str(e), status=400)

        send_sync_group_message(CONSULTANCY_GROUP_NAME, "A new Client has been created from form.")
        return Response("Success: Data processed successfully.", status=200)



class SonViewSet(viewsets.ModelViewSet):
    queryset = Son.objects.all()
    serializer_class = SonSerializer

    def create(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        self.serializer_class = SonCreateSerializer
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
        child_json = request.data

        # Get ID family
        id_client = child_json['id_consultant']
        client = Client.objects.filter(id_value=id_client).first()
        if not client:
            return Response(f"Error: Consultant with ID value {id_client} not Found.", status=404)
        family = Family.objects.get(pk=client.id)
        if not family:
            return Response(f"Error: Family for client with ID value {client.id_value} not Found.", status=404)
        child_json["family_client_user"] = family.id

        serializer = SonCreateSerializer(data=child_json)

        if serializer.is_valid():
            serializer.save()
            send_sync_group_message(CONSULTANCY_GROUP_NAME, f"A new child was registered for a Client {client} with ID {client.id}.")
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors, status=400)


class TelViewSet(viewsets.ModelViewSet):
    queryset = Tel.objects.all()
    serializer_class = TelSerializer
    permission_classes = [CheckGroupPermission]
