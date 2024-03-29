''' 
    modelViewSet is a class that allows you to create a CRUD
'''
from rest_framework.viewsets import ModelViewSet
from BoardUser.api.serializers import BoardUserSerializer
from BoardUser.models import BoardUser
from User.permissions import CheckGroupPermission


class BoardUserViewSet(ModelViewSet):
    permission_classes = [CheckGroupPermission]
    queryset = BoardUser.objects.all()
    serializer_class = BoardUserSerializer
    def get_queryset(self):
        """
        Optionally restricts the returned boarduser to given user,
        by filtering against a `user_id` query parameter in the URL.
        """
        queryset = super().get_queryset() 
        user_id = self.request.query_params.get('user_id', None)
        if user_id is not None:
            queryset = queryset.filter(user=user_id)
        return queryset
