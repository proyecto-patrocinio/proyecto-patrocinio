from Clients.api.viewsets import *
from rest_framework import routers


router = routers.DefaultRouter()
router.register('client', ClientViewSet)
router.register('patrimony', PatrimonyViewSet, basename='patrimony')
router.register('family', FamilyViewSet, basename='family')
router.register('son', SonViewSet, basename='son')
router.register('tel', TelViewSet, basename='tel')