from Clients.api.serializers import *
from Clients.models import *
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
# list, create, retrieve, update, partial_update, destroy


class ClientViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

    def get_serializer(self, *args, **kwargs): #select json format
        if self.action == 'list' or self.action == 'create': #by /api/locality/
            return ClientSerializer(*args, **kwargs)
    


    
class PatrimonyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Patrimony.objects.all()
    serializer_class = PatrimonySerializer
    
class FamilyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Family.objects.all()
    serializer_class = FamilySerializer
    
class SonViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Son.objects.all()
    serializer_class = SonSerializer    
    
    
class TelViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Tel.objects.all()
    serializer_class = TelSerializer