''' 
    modelViewSet is a class that allows you to create a CRUD
'''
import os
import logging
from constants import ATTACHMENT_FILES_DIRECTORY
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
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
from django.http import FileResponse
from rest_framework.decorators import action


logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


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


class FileViewSet(ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileGetSerializer

    def create(self, request, *args, **kwargs):
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
                    filepath = f"{ATTACHMENT_FILES_DIRECTORY}/{filename_disk}"
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
        try:
            file_id = self.get_object().pk
            download_filename = File.objects.get(id=file_id).filename
            filepath_disk =  f"{ATTACHMENT_FILES_DIRECTORY}/{file_id}"
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
            try:
                instance = self.get_object()
                filename = instance.filename
                filepath = f"{ATTACHMENT_FILES_DIRECTORY}/{instance.id}"

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
