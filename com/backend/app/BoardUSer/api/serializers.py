'''
    serializer is a class that allows you to convert the data from the database to *json*.
'''
from BoardUSer.models import *
from rest_framework.serializers import ModelSerializer


class BoardUserSerializer(ModelSerializer):

    class Meta:
        model = BoardUser
        fields = ["id", "user_id", "board_id"]
        read_only_field = ["id", "user_id", "board_id"]
