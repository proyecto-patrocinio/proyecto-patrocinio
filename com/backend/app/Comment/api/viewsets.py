'''
    modelViewSet is a class that allows you to create a CRUD
'''
import os
import logging

from django.db import transaction
from django.contrib.auth.models import User
from django.http import FileResponse
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action

from constants import ATTACHMENT_FILES_DIRECTORY
from Comment.models import Comment, File
from Comment.api.serializers import (
    CommentSerializer,
    CommentCreateSerializer,
    CommentEditSerializer,
    CommentDestroySerializer,
    FileUploadSerializer,
    FileCreatedSerializer,
    FileGetSerializer
)
from User.permissions import CheckGroupPermission


logger = logging.getLogger(__name__)


class CommentApiViewSet(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def create(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        self.serializer_class = CommentCreateSerializer
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        self.serializer_class = CommentEditSerializer
        return  super().update(request, *args, **kwargs)

    def partial_update(self, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        return  super().partial_update(request, *args, **kwargs)

    @transaction.atomic
    def destroy(self, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        self.serializer_class = CommentDestroySerializer
        comment_id = self.get_object().pk
        try:
            comment = Comment.objects.prefetch_related('files').get(pk=comment_id)
        except Comment.DoesNotExist:
            raise Http404

        # Delete attachment files from disk.
        for file in comment.files.all():
            file_path = f"{ATTACHMENT_FILES_DIRECTORY}{file.id}"
            if os.path.exists(file_path):
                os.remove(file_path)
        return super().destroy(*args, **kwargs)

    def list(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        # FILTER COMMENTS BY USER AND/OR CONSULTATION ID.
        self.queryset = self.queryset.prefetch_related('files')
        user_id = self.request.query_params.get('user_id', None)
        consultation_id = self.request.query_params.get('consultation_id', None)
        if user_id is not None:
            self.queryset = self.queryset.filter(user=user_id).order_by('-time_stamp')
        if consultation_id is not None:
            self.queryset = self.queryset.filter(consultation=consultation_id).order_by('-time_stamp')
        return super().list(request, *args, **kwargs)


class FileViewSet(ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileGetSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
            self.permission_classes = [CheckGroupPermission]
            self.serializer_class = FileUploadSerializer
            try:
                uploadedFile = request.FILES['uploadedFile']

                self.serializer_class = FileCreatedSerializer
                response = super().create(request, *args, **kwargs)
                if response.status_code == status.HTTP_201_CREATED:
                    filename_disk = response.data['id']

                    if not os.path.exists(ATTACHMENT_FILES_DIRECTORY):
                        os.makedirs(ATTACHMENT_FILES_DIRECTORY)

                    # Save the file to disk
                    filepath = f"{ATTACHMENT_FILES_DIRECTORY}{filename_disk}"
                    with open(filepath, 'wb') as destination:
                        for chunk in uploadedFile.chunks():
                            destination.write(chunk)
                    logger.info(f"File {filename_disk} was successfully uploaded.")

                return response

            except Exception as e:
                logger.error('Error while try to create file.')
                logger.debug(f"Error details: {str(e)}")
                response = Response()
                response.status_code = status.HTTP_400_BAD_REQUEST
                return response

    @action(detail=True, methods=['get'])
    def download(self, request, *args, **kwargs):
        self.permission_classes = [IsAuthenticated]
        try:
            file_id = self.get_object().pk
            download_filename = File.objects.get(id=file_id).filename
            filepath_disk =  f"{ATTACHMENT_FILES_DIRECTORY}{file_id}"
            logger.info(f"Downloading {filepath_disk} file with filename: {download_filename}...")

            file = open(filepath_disk, 'rb')

            response = FileResponse(file)
            response['Content-Type'] = 'application/octet-stream'
            response['Content-Disposition'] = f'attachment; filename="{download_filename}"'

            return response
        except Exception as e:
            mns = f"Unexpected error while trying to upload '{download_filename}' file."
            logger.error(mns)
            logger.debug(f"Error details: {str(e)}")
            return Response(mns, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, *args, **kwargs):
        self.permission_classes = [CheckGroupPermission]
        try:
            instance = self.get_object()
            filename = instance.filename
            filepath = f"{ATTACHMENT_FILES_DIRECTORY}{instance.id}"

            # First remove the file from disk
            if os.path.exists(filepath):
                os.remove(filepath)
                logger.info(f"File {filename} was successfully deleted from disk.")

            # Then, delete from database
            self.perform_destroy(instance)

            return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            mns = f"Error while trying to delete file"
            logger.error(mns, f". Error details: {str(e)}")
            return Response(mns, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
