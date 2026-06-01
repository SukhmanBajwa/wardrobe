from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .permissions import IsOwner
from .serializers import ClothingItemSerializer, CategoriesSerializer
from .models import ClothingItem, Category
from rest_framework import filters

# Create your views here.


class ClothingItemViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOwner]
    serializer_class = ClothingItemSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "description", "item__tag__name"]

    def get_queryset(self):
        user = self.request.user
        category = self.request.query_params.get("category")

        # pylint: disable=no-member
        queryset = ClothingItem.objects.filter(user=user)

        if category:
            queryset = queryset.filter(category__name=category)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ClothesCategoriesViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOwner]
    serializer_class = CategoriesSerializer

    def get_queryset(self):
        user = self.request.user
        return Category.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
