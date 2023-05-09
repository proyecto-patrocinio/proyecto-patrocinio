''' 
    modelViewSet is a class that allows you to create a CRUD
'''
from rest_framework.viewsets import ModelViewSet
from django.db.models import Prefetch

from BoardUSer.api.serializers import BoardUserSerializer
from BoardUSer.models import BoardUser
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework import mixins



class BoardUserViewSet(ModelViewSet): 
    queryset = BoardUser.objects.all() #all the data in the table
    serializer_class = BoardUserSerializer #select the serializer
