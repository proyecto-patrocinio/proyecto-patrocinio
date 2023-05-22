from rest_framework.viewsets import ModelViewSet
from Panel.models import Panel
from Panel.api.serializers import PanelSerializer, PanelFullSerializer
from rest_framework.response import Response
from django.db.models import Prefetch

class PanelViewSet(ModelViewSet):
    queryset = Panel.objects.all()
    serializer_class = PanelSerializer

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = PanelFullSerializer
        self.queryset = self.queryset.prefetch_related( 
                        Prefetch('cards')
        )
        return super().retrieve(request, *args, **kwargs)
