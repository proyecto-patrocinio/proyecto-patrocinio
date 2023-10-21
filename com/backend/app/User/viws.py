from  serializers import UserSerializer
from  serializers import UserFullSerializer
from django.contrib.auth.models import User
from rest_framework import viewsets
from django.db.models import Prefetch

class BoardViewSet(viewsets.ModelViewSet):
  queryset = User.objects.all()
  serializer_class = UserSerializer
  def retrieve(self, request, *args, **kwargs):
        self.serializer_class = UserFullSerializer
        self.queryset = self.queryset.prefetch_related( 
                        Prefetch('boardusers')
        )
        return super().retrieve(request, *args, **kwargs)
