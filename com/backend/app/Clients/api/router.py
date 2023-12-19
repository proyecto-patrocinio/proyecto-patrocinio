from Clients.api.viewsets import *
from rest_framework import routers


router_clients = routers.DefaultRouter()

router_clients.register('client', viewset=ClientViewSet, basename='client')
router_clients.register('patrimony', PatrimonyViewSet, basename='patrimony')
router_clients.register('family', FamilyViewSet, basename='family')
router_clients.register('child', childViewSet, basename='child')
router_clients.register('tel', TelViewSet, basename='tel')