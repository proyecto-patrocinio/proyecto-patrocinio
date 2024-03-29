from django.contrib.auth.models import User
from rest_framework import serializers
from BoardUser.api.serializers import BoardUserSerializer


class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UserFullSerializer(serializers.ModelSerializer):
    boardusers = BoardUserSerializer( many = True, read_only = True )
    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ("boardusers")