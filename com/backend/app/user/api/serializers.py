'''
    serializer is a class that allows you to convert the data from the database to *json*.
'''
from user.models import User
from rest_framework.serializers import ModelSerializer


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username",  "email"]
        read_only_field = ["id"]


class UserDetailSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email", "date_joined", "last_login", "description"]
        read_only_field = ["id", "date_joined", "last_login"]
