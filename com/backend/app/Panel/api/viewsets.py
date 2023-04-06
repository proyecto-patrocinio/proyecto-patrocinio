from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.viewsets import ModelViewSet
from Panel.models import Panel
from Panel.api.serializers import PanelSerializer
# Create your views here.

class PanelViewSet(ModelViewSet):
    queryset = Panel.objects.all()
    serializer_class = PanelSerializer
    permission_classes = [ IsAuthenticated ]
    # idealmente es IsAuthenticated
    #permission_classes = [ IsAuthenticated ]
    
    def get_serializer(self, *args, **kwargs): #select json format
        if self.action == 'list' or self.action == 'create': #by /api/locality/
            return PanelSerializer(*args, **kwargs)