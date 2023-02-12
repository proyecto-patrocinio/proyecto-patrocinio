'''
    serializer is a class that allows you to convert the data from the database to *json*.
'''

from rest_framework.serializers import ModelSerializer
from locality.models import Locality, Province, Nationality


#Simple serializers (list)
class NationalityOneSerializer(ModelSerializer):
    class Meta:
        model = Nationality
        fields = ('id', 'name',)        

class ProvinceOneSerializer(ModelSerializer):
    class Meta:
        model = Province
        fields = ('id', 'name', 'nationality',)
        

class LocalityOneSerializer(ModelSerializer): 
    class Meta:
        model = Locality
        fields = ('id', 'name', 'province',)

#Auxiliary serializers
class ProvinceAndNationalitySerializer(ModelSerializer): #used in LocalityFullSerializer
    nationality = NationalityOneSerializer(many=False, read_only=True) #formated json data
    class Meta: 
        model = Province 
        fields = ('id', 'name', 'nationality',)  #fields to show

# Details serializers (retrieve)
class LocalityFullSerializer(ModelSerializer):
    province = ProvinceAndNationalitySerializer(many=False, read_only=True)
    class Meta:
        model = Locality
        fields = ('id', 'name', 'province',)

class ProvinceFullSerializer(ModelSerializer):
    localities = LocalityOneSerializer(many=True, read_only=True)  
    class Meta:
        model = Province
        fields = ('id', 'name', 'localities',)
        read_only_fields = ('localities',)

class NationalityFullSerializer(ModelSerializer):
    provinces = ProvinceOneSerializer(many=True, read_only=True)
    class Meta:
        model = Nationality
        fields = ('id', 'name','provinces', )
        read_only_fields = ('provinces',)
