'''
    serializer is a class that allows you to convert the data from the database to *json*.
'''

from rest_framework.serializers import ModelSerializer
from Comment.models import Comment


class CommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class CommentEditSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('id', 'consultation', 'time_stamp', 'user')

class CommentCreateSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('id', 'time_stamp')

class CommentDestroySerializer(ModelSerializer):
    class Meta:
        model = Comment
