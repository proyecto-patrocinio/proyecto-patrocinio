''' 
    modelViewSet is a class that allows you to create a CRUD
'''
from rest_framework.viewsets import ModelViewSet
from django.db.models import Prefetch
from Comment.models import Comment
from Comment.api.serializers import (
    CommentSerializer,
    CommentCreateSerializer,
    CommentEditSerializer,
    CommentDestroySerializer
)


class CommentApiViewSet(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def create(self, request, *args, **kwargs):
        self.serializer_class = CommentCreateSerializer
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.serializer_class = CommentEditSerializer
        return  super().update(request, *args, **kwargs)

    def destroy(self, *args, **kwargs):
        self.serializer_class = CommentDestroySerializer
        return super().destroy(*args, **kwargs)

    def list(self, request, *args, **kwargs):
        # FILTER BY USER AND/OR CONSULTATION ID.
        user_id = self.request.query_params.get('user_id', None)
        consultation_id = self.request.query_params.get('consultation_id', None)
        if user_id is not None:
            self.queryset = self.queryset.filter(user=user_id)
        if consultation_id is not None:
            self.queryset = self.queryset.filter(consultation=consultation_id)
        return super().list(request, *args, **kwargs)
