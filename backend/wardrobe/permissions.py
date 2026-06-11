from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    message = "Not owner"

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
