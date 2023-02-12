from  rest_framework.routers import  DefaultRouter
from user.api.views  import  UserApiViewSet

router_user  =  DefaultRouter()
router_user.register ( prefix='' ,   basename='user' ,    viewset=UserApiViewSet )