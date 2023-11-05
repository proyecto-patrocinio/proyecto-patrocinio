from Clients.api.serializers import *
from Clients.models import *
from rest_framework import viewsets
from django.db.models import Prefetch
# list, create, retrieve, update, partial_update, destroy


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

    def list(self, request, *args, **kwargs):
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
        self.serializer_class = ClientDestroySerializer
        return super().destroy(request, *args, **kwargs)

class PatrimonyViewSet(viewsets.ModelViewSet):
    queryset = Patrimony.objects.all()
    serializer_class = PatrimonySerializer

class FamilyViewSet(viewsets.ModelViewSet):
    queryset = Family.objects.all()
    serializer_class = FamilySerializer

class SonViewSet(viewsets.ModelViewSet):
    queryset = Son.objects.all()
    serializer_class = SonSerializer

class TelViewSet(viewsets.ModelViewSet):
    queryset = Tel.objects.all()
    serializer_class = TelSerializer
