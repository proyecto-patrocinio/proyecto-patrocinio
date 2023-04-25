'''
    serializer is a class that allows you to convert the data from the database to *json*.
'''
from BoardUSer.models import *
from rest_framework.serializers import ModelSerializer


class BoardUserSerializer(ModelSerializer):

    class Meta:
        model = BoardUser
        fields = ["id", "user_id"]
        read_only_field = ["id"]


# class UserDetailSerializer(ModelSerializer):

#     class Meta:
#         model = User
#         fields = ["id", "username", "first_name", "last_name", "email", "date_joined", "last_login", "description"]
#         read_only_field = ["id", "date_joined", "last_login"]
