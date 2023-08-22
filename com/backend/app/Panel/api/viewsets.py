from rest_framework.viewsets import ModelViewSet
from Panel.models import Panel
from Panel.api.serializers import (
    PanelSerializer,
    PanelFullSerializer,
    PanelWithNumberCardsSerializer
)
from rest_framework.response import Response
from django.db.models import Prefetch, Count

class PanelViewSet(ModelViewSet):
    queryset = Panel.objects.all()
    serializer_class = PanelSerializer

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = PanelFullSerializer
        self.queryset = self.queryset.prefetch_related(
                        Prefetch('cards')
        )
        return super().retrieve(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        self.queryset = Panel.objects.prefetch_related(
            Prefetch('cards')
        ).annotate(
            number_cards=Count('cards', distinct=True)
        )
        self.serializer_class = PanelWithNumberCardsSerializer
        return super().list(request, *args, **kwargs)
