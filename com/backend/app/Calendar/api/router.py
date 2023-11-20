from rest_framework import routers
from Calendar.api.views import CalendarViewSet, EventViewSet

router_calendar = routers.DefaultRouter()

router_calendar.register('calendar', viewset=CalendarViewSet, basename='calendar')
router_calendar.register('event', viewset=EventViewSet, basename='event')
