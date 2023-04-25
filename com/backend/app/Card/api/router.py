from Card.api.viewsets import *
from rest_framework import routers


router_card = routers.DefaultRouter()

router_card.register('Card', viewset=CardViewSet, basename='card')
