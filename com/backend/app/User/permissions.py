from rest_framework import permissions
from django.contrib.auth.models import Permission


class CheckGroupPermission(permissions.BasePermission):
    """Permission class to check if the user has the necessary group permissions"""

    def has_permission(self, request, view):
        """Check if the user has the necessary group permissions for the specified action on the model.

        Args:
            request (HttpRequest): The HTTP request object.
            view (View): The DRF view instance.

        Returns:
            bool: True if the user has the necessary permissions, False otherwise.
        """
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.groups.exists():
            group_permissions = Permission.objects.filter(group__in=request.user.groups.all())

            action_perm_mapping = {
                'list': 'view',
                'retrieve': 'view',
                'create': 'add',
                'update': 'change',
                'partial_update': 'change',
                'destroy': 'delete',
            }
            view_action = action_perm_mapping.get(view.action, view.action)
            model_name = view.queryset.model._meta.model_name
            action_perm = f'{view_action}_{model_name}'

            print(group_permissions.filter(codename=action_perm))
            return group_permissions.filter(codename=action_perm).exists()

        return False
