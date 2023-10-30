from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from django.http import HttpResponse
import os

TERMS_FILE_NAME = 'terms_and_policies/terms_and_policies.md'

@api_view(http_method_names=['GET'])
@permission_classes([AllowAny])
@authentication_classes([])
def get_file_contentView(request):
    try:
        file_path = os.path.join(os.curdir, TERMS_FILE_NAME)
        with open(file_path, 'r') as file:
            content = file.read()
        response = HttpResponse(content, content_type='text/plain')
        return response
    except FileNotFoundError:
        return HttpResponse('The terms and policies file was not found.', status=404)

@api_view(http_method_names=['GET'])
@permission_classes([AllowAny])
@authentication_classes([])
def download_file_contentView(request):
    try:
        file_path = os.path.join(os.curdir, TERMS_FILE_NAME)
        with open(file_path, 'r') as file:
            content = file.read()
        response = HttpResponse(content, content_type='text/plain')
        response['Content-Disposition'] = 'attachment; filename="terms_and_policies.md"'
        return response
    except FileNotFoundError:
        return HttpResponse('The terms and policies file was not found.', status=404)
