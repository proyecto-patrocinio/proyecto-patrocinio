from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.viewsets import ModelViewSet
from Panel.models import Panel
from Panel.api.serializers import PanelSerializer, PanelFullSerializer
from rest_framework.response import Response
from django.db.models import Prefetch
# Create your views here.

class PanelViewSet(ModelViewSet):
    queryset = Panel.objects.all()
    permission_classes = [ IsAuthenticated ]


    def get_serializer(self, *args, **kwargs): #select json format
        if self.action == 'list' or self.action == 'create': #by /api/panels/panel/
            return PanelSerializer(*args, **kwargs)
        else:
            return PanelFullSerializer(*args, **kwargs) #by /api/panels/panel/1
    
    def get_queryset(self): #select the detail data from the table
        queryset = super().get_queryset() 
        if self.action == 'retrieve': #by /api/locality/id
                queryset = queryset.prefetch_related( 
                    Prefetch('cards') 
                )
        #else is a "list" -> /api/locality/
        return queryset #return SQL query   