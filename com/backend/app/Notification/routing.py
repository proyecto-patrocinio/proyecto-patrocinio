from django.urls import re_path

from . import consummers

websocket_urlpatterns = [
    re_path(r'ws/notification/(?P<room_name>\w+)/$', consummers.NotificationConsumer.as_asgi())

]
