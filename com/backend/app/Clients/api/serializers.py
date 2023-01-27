from rest_framework import serializers
from ..models import *



class ClientSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Client
        fields = '__all__'
     
    # def create(self, validated_data):
    #     return Client.objects.create(**validated_data)
  

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
        
     