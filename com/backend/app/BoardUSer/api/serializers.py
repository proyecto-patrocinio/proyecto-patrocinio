'''
    serializer is a class that allows you to convert the data from the database to *json*.
'''
from BoardUSer.models import *
from rest_framework.serializers import ModelSerializer


class BoardUserSerializer(ModelSerializer):

    class Meta:
        model = BoardUser
        fields = '__all__'
        read_only_field = ["id","board","user"]
