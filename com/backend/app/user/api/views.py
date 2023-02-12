''' 
    modelViewSet is a class that allows you to create a CRUD
'''
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.viewsets import ModelViewSet
from django.db.models import Prefetch

from user.api.serializers import UserSerializer, UserDetailSerializer
from user.models import User
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework import mixins



class UserApiViewSet(ModelViewSet): 
    queryset = User.objects.all() #all the data in the table 
    permission_classes = [ IsAuthenticated  ] #only authenticated users can access

    def get_serializer(self, *args, **kwargs): #select json format
        if self.action == 'list' or self.action == 'create': #by /api/user/
           return UserSerializer(*args, **kwargs)
        return UserDetailSerializer(*args, **kwargs) #else, /api/user/id 

