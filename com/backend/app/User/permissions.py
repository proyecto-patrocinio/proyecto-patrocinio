from rest_framework import permissions
from django.contrib.auth.models import Permission, PermissionsMixin
from django.contrib.auth.models import User


ACTION_PERM_MAPPING = {
    'list': 'view',
    'retrieve': 'view',
    'create': 'add',
    'update': 'change',
    'partial_update': 'change',
    'destroy': 'delete',
}


class CheckGroupPermission(permissions.BasePermission):
    """Permission class to check if the user has the necessary group permissions."""

    def has_permission(self, request, view) -> bool:
        """Check if the user is authenticated and has either individual or group permissions
        for the specified action on the model.

        Args:
            request (HttpRequest): The HTTP request object.
            view (View): The DRF view instance.

        Returns:
            bool: True if the user has the necessary permissions, False otherwise.
        """
        if not request.user or not request.user.is_authenticated:
            return False

        # Get Permission name
        view_action = ACTION_PERM_MAPPING.get(view.action, view.action)
        model_name = view.queryset.model._meta.model_name
        action_perm = f'{view_action}_{model_name}'

        # Check Individual Permissions
        user_data = User.objects.get(username=request.user.username)
        user_permissions = user_data.user_permissions.all()
        is_user_has_permission = user_permissions.filter(codename=action_perm).exists()
        if is_user_has_permission:
            return True

        # Check Group Permissions
        if request.user.groups.exists():
            group_permissions = Permission.objects.filter(group__in=request.user.groups.all())

            return group_permissions.filter(codename=action_perm).exists()

        return False


class CaseTakerGroupPermission(permissions.BasePermission):
    """Permission class to check if the user belongs to the 'case_taker' group."""
    def has_permission(self, request, view):

        if not request.user or not request.user.is_authenticated:
            return False

        return request.user.groups.filter(name='case_taker').exists()


class ProfessorGroupPermission(permissions.BasePermission):
    """Permission class to check if the user belongs to the 'professor' group."""

    def has_permission(self, request, view):

        if not request.user or not request.user.is_authenticated:
            return False

        return request.user.groups.filter(name='professor').exists()


class FormsGroupPermission(permissions.BasePermission):
    """Permission class to check if the user belongs to the 'forms' group."""

    def has_permission(self, request, view):

        if not request.user or not request.user.is_authenticated:
            return False

        return request.user.groups.filter(name='forms').exists()
