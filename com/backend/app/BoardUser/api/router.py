from  rest_framework.routers import  DefaultRouter
from BoardUser.api.views  import  BoardUserViewSet 

router_boardUser  =  DefaultRouter()
router_boardUser.register( 'boarduser', BoardUserViewSet, basename='board_user')
