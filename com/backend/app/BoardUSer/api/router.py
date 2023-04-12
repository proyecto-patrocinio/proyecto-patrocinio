from  rest_framework.routers import  DefaultRouter
from BoardUSer.api.views  import  BoardUserViewSet 

router_boardUser  =  DefaultRouter()
router_boardUser.register( 'boardUser', BoardUserViewSet, basename='board_user')