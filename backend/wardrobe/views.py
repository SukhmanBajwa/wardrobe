from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .permissions import IsOwner
from .serializers import ClothingItemSerializer, CategoriesSerializer
from .models import ClothingItem, Category
from rest_framework import filters
from ai_recommendations import services

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
        queryset = ClothingItem.objects.filter(user=user, is_deleted=False)

        if category:
            queryset = queryset.filter(category__name=category)
        return queryset

    # method override from CreateModelMixin to change the behaviour of save. Include user info

    def perform_create(self, serializer):
        new_item = serializer.save(user=self.request.user)
        item_info = ClothingItemSerializer(new_item).data
        inventory_data = ClothingItemSerializer(self.get_queryset(), many=True).data
        ai_reply, response_status = services.Ai_Recommendation(
            item_info, inventory_data
        )
        services.Save_Ai_Recommendations(new_item.id, ai_reply)

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

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
