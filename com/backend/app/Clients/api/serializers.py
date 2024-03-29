from rest_framework import serializers
from Clients.models import *
from rest_framework.serializers import ModelSerializer
from locality.api.serializers import LocalityFullSerializer


class ClientSerializer(ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'
        read_only_fields = ['id',]

class PatrimonyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patrimony
        fields = '__all__'
        read_only_fields = ['id',]

class PatrimonySerializer(serializers.ModelSerializer):
    class Meta:
        model = Patrimony
        fields = '__all__'

class ClientPatrimonySerializer(serializers.ModelSerializer):
    class Meta:
        model = Patrimony
        fields = ('id', 'employment', 'salary', 'other_income', 'amount_other_income','amount_retirement', 'amount_pension', 'vehicle')

class FamilySerializer(serializers.ModelSerializer):
    class Meta:
        model = Family
        fields = '__all__'

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

class FamilyFullSerializer(serializers.ModelSerializer):
    children = ChildFullSerializer( many = True, read_only = True)
    class Meta:
        model = Family
        fields = ('id','partner_salary', 'children')

class ClientFullSerializer(serializers.ModelSerializer):
    locality = LocalityFullSerializer( many = False, read_only = True)
    patrimony = ClientPatrimonySerializer( many = False, required=False, allow_null=True)
    tels = ClientTelSerializer(many = True, required=False, allow_null=True )
    family = FamilyFullSerializer(many = False, required=False, allow_null=True )
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
