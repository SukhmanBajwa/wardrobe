import threading

from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .permissions import IsOwner
from .serializers import ClothingItemSerializer, CategoriesSerializer, TagsSerializer
from .models import ClothingItem, Category, Tag
from rest_framework import filters
from ai_recommendations import services

# Create your views here.


class ClothingItemViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOwner]
    serializer_class = ClothingItemSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "description", "tagged_item__tag__name"]

    def get_queryset(self):
        user = self.request.user
        category = self.request.query_params.get("category")

        # pylint: disable=no-member
        queryset = ClothingItem.objects.filter(user=user, is_deleted=False)

        if category:
            queryset = queryset.filter(category__name=category)
        return queryset

    @staticmethod
    def run_recommendations(new_item, inventory_data):
        item_info = ClothingItemSerializer(new_item).data
        ai_reply, _ = services.Ai_Recommendation(item_info, inventory_data)
        services.Save_Ai_Recommendations(new_item.id, ai_reply)

    # method override from CreateModelMixin to change the behaviour of save. Include user info
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # method override from DestroyModelMixin to change behaviour to mark object "is_delete: True"
    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()


class ClothesCategoriesViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOwner]
    serializer_class = CategoriesSerializer

    def get_queryset(self):
        user = self.request.user
        return Category.objects.filter(user=user)

    # passing in user to assign categories their owners,
    # no need to override other crud functions as nothing is been added to functions, not even user.
    # oncce user is assigned by create, it is never changed.
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save()


class TagsViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOwner]
    serializer_class = TagsSerializer

    def get_queryset(self):
        user = self.request.user
        return Tag.objects.filter(user=user)

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user)

    def perform_destroy(self, instance):
        instance.delete()
