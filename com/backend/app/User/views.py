from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_protect


@api_view(http_method_names=['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
@csrf_protect
def get_user_info_from_token(request):
    """View to retrieve user information based on a provided authentication token.

    This view requires a valid authentication token and will return information about the authenticated user.

    Args:
        request (HttpRequest): The HTTP request object containing the token.

    Returns:
        Response: A JSON response with user information if authentication is successful.
    """
    token_key = request.GET.get('token')

    if not token_key:
        return Response(data={'error': 'Token was not provided in the request.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        token = Token.objects.select_related('user').get(key=token_key)
        user = token.user
        roles = [group.name for group in request.user.groups.all()]
        return Response({
            'pk': user.pk,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'roles': roles
        }, status=status.HTTP_200_OK)

    except Token.DoesNotExist:
        raise AuthenticationFailed("Invalid or not found token.")
