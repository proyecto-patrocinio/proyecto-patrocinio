''' 
    modelViewSet is a class that allows you to create a CRUD
'''
from django.db.models import Prefetch
from rest_framework.viewsets import ModelViewSet
from User.permissions import CheckGroupPermission

from locality.models import Locality, Province, Nationality
from locality.api.serializers import LocalityOneSerializer,     \
                                    ProvinceFullSerializer,     \
                                    ProvinceOneSerializer,      \
                                    NationalityOneSerializer,   \
                                    NationalityFullSerializer,  \
                                    LocalityFullSerializer


class LocalityApiViewSet(ModelViewSet): 
    queryset = Locality.objects.all() # All the data in the table
    permission_classes = [CheckGroupPermission]

    def get_serializer(self, *args, **kwargs):  # Select json format
        if self.action == 'list' or self.action == 'create':  # By /api/locality/
            return LocalityOneSerializer(*args, **kwargs)
        return LocalityFullSerializer(*args, **kwargs)  # Else, /api/locality/id

    def get_queryset(self): #select the detail data from the table
        queryset = super().get_queryset() 
        if self.action == 'retrieve':  # By /api/locality/id
            # Select_related is a method that allows you to select the data from the table
            queryset=queryset.select_related('province','province__nationality')
        # Else is a "list" -> /api/locality/
        return queryset #return SQL query


class ProvinceApiViewSet(ModelViewSet):
    queryset = Province.objects.all()
    permission_classes = [CheckGroupPermission]

    def get_serializer(self, *args, **kwargs):
        if self.action == 'list' or self.action == 'create':
            return ProvinceOneSerializer(*args, **kwargs)
        return ProvinceFullSerializer(*args, **kwargs)

    def get_queryset(self): 
        queryset = super().get_queryset() 
        if self.action == 'retrieve':
            queryset = queryset.prefetch_related( 
                Prefetch('localities') 
            )
        return queryset


class NationalityApiViewSet(ModelViewSet):
    queryset = Nationality.objects.all() 
    permission_classes = [CheckGroupPermission]

    def get_serializer(self, *args, **kwargs):
        if self.action == 'list' or self.action == 'create':
            return NationalityOneSerializer(*args, **kwargs)
        return NationalityFullSerializer(*args, **kwargs)

    def get_queryset(self): 
        queryset = super().get_queryset()
        if self.action == 'retrieve':
            queryset = queryset.prefetch_related(
                Prefetch('provinces') 
            )
        return queryset
