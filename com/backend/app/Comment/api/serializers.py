'''
    serializer is a class that allows you to convert the data from the database to *json*.
'''

from rest_framework.serializers import ModelSerializer
from Comment.models import Comment, File
from rest_framework import serializers
from User.serializers import UserSimpleSerializer

class CommentSerializer(ModelSerializer):
    user = UserSimpleSerializer()
    class Meta:
        model = Comment
        fields = ['id', 'time_stamp', 'text', 'consultation', 'user']

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



class FileUploadSerializer(ModelSerializer):
    uploadedFile = serializers.FileField()
    class Meta:
        model = File
        fields = '__all__'
        read_only = ['id', 'time_stamp']

class FileCreatedSerializer(ModelSerializer):
    class Meta:
        model = File
        fields = '__all__'
        read_only = ['id', 'time_stamp']

class FileGetSerializer(ModelSerializer):
    class Meta:
        model = File
        fields = '__all__'
        read_only = ['id', 'time_stamp', 'comment']