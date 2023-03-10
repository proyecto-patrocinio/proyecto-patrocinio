from rest_framework import serializers
from Clients.models import *
from rest_framework.serializers import ModelSerializer



class ClientSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Client
        fields = '__all__'

class PatrimonySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Patrimony
        fields = '__all__'        


class FamilySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Family
        fields = '__all__'    
        
class SonSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Son
        fields = '__all__'    
        
        
class TelSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Tel
        fields = '__all__'    
        
     