from  rest_framework.routers import  DefaultRouter
from locality.api.views  import  LocalityApiViewSet, ProvinceApiViewSet, NationalityApiViewSet

router_locality  =  DefaultRouter()

router_locality.register ( prefix='locality' ,   basename='locality' ,    viewset=LocalityApiViewSet )
router_locality.register ( prefix='province',    basename='province' ,    viewset=ProvinceApiViewSet )
router_locality.register ( prefix='nationality', basename='nationality' , viewset=NationalityApiViewSet )
