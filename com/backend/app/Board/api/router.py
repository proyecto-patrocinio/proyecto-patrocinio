from Board.api.viewsets import *
from rest_framework import routers


router_board = routers.DefaultRouter()

router_board.register('board', viewset=BoardViewSet, basename='board')

