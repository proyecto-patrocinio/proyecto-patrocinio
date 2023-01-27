from .serializers import *
from ..models import *
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
# list, create, retrieve, update, partial_update, destroy


class ClientViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    
    

    # @action(methods=['GET','POST'], detail = False)
    # def client_list(self,request):
        
    #     if request.method == 'GET':
    #         clients = self.get_queryset()
    #         serializer = self.get_serializer_class()(clients)
    #         return Response(serializer.data)    
        
    #     if request.method == 'POST':
    #         return Response('HOLA')

    
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