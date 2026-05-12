from rest_framework import serializers

from .models import ClothingItem


class ClothingItemSearializer(serializers.ModelSerializer):
    class Meta:
        model = ClothingItem
        fields = ["name", "category", "description", "image_url", "user"]
        read_only_fields = ["user"]
