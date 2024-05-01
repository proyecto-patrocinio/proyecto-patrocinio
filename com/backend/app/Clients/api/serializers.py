from rest_framework import serializers
from Clients.models import *
from rest_framework.serializers import ModelSerializer
from locality.api.serializers import LocalityFullSerializer


class ClientSerializer(ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'
        read_only_fields = ['id',]


class ChildCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Child
        fields = '__all__'
        read_only_fields = ['id',]

class ChildSerializer(serializers.ModelSerializer):
    class Meta:
        model = Child
        fields = '__all__'

class TelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tel
        fields = '__all__'

class ClientTelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tel
        fields = ('id', 'phone_number')

class ChildFullSerializer(serializers.ModelSerializer):
    locality = LocalityFullSerializer( many = False, read_only = True)
    class Meta:
        model = Child
        fields = '__all__'
        read_only_fields = ['id',]


class ClientFullSerializer(serializers.ModelSerializer):
    locality = LocalityFullSerializer( many = False, read_only = True)
    tels = ClientTelSerializer(many = True, required=False, allow_null=True )
    children = ChildFullSerializer(many = True, required=False, allow_null=True )
    class Meta:
        model = Client
        fields = '__all__'

class ClientSimpleSerializer(serializers.ModelSerializer):
        locality = LocalityFullSerializer( many = False, read_only = True)
        class Meta:
            model = Client
            fields = '__all__'

class ClientDestroySerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
