from Panel.api.viewsets import *
from rest_framework import routers


router_panel = routers.DefaultRouter()

router_panel.register('Panel', PanelViewSet)