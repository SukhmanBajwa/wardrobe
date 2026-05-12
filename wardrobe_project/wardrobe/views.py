from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .permissions import IsOwner
from .serializers import ClothingItemSearializer
from .models import ClothingItem

# Create your views here.


class ClothingItemViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOwner]
    serializer_class = ClothingItemSearializer

    def get_queryset(self):
        user = self.request.user
        # pylint: disable=no-member
        return ClothingItem.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
