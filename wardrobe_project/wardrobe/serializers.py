from rest_framework import serializers

from .models import ClothingItem


class ClothingItemSearializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField(
        many=False
    )  # This will display the category name instead of the ID

    class Meta:
        model = ClothingItem
        fields = ["id", "name", "category", "description", "image_url", "user"]
        read_only_fields = ["user"]
