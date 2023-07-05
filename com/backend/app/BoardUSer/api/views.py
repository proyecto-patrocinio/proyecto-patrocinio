''' 
    modelViewSet is a class that allows you to create a CRUD
'''
from rest_framework.viewsets import ModelViewSet
from BoardUSer.api.serializers import BoardUserSerializer
from BoardUSer.models import BoardUser



class BoardUserViewSet(ModelViewSet):
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
