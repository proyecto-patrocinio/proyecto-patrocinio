''' 
    modelViewSet is a class that allows you to create a CRUD
'''
from rest_framework.viewsets import ModelViewSet
from BoardUSer.api.serializers import BoardUserSerializer
from BoardUSer.models import BoardUser



class BoardUserViewSet(ModelViewSet): 
    queryset = BoardUser.objects.all()
    serializer_class = BoardUserSerializer
