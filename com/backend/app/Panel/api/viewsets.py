from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.viewsets import ModelViewSet
from Panel.models import Panel
from Panel.api.serializers import PanelSerializer
from rest_framework.response import Response
# Create your views here.

class PanelViewSet(ModelViewSet):
    queryset = Panel.objects.all()
    serializer_class = PanelSerializer
    permission_classes = [ IsAuthenticated ]
    # idealmente es IsAuthenticated
    #permission_classes = [ AllowAny ]
    
    #def get_serializer(self, *args, **kwargs): #select json format
        #if self.action == 'list' or self.action == 'create': #by /api/locality/
            #return PanelSerializer(*args, **kwargs)
        
    def list(self, request):
        # Obtener todas las provincias y serializarlas
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)