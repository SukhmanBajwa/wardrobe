from rest_framework import serializers

from .models import ClothingItem, ClothingItemTag


class ClothingItemSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField(
        many=False
    )  # This will display the category name instead of the ID
    tags = serializers.SerializerMethodField()

    def get_tags(self, obj):
        rows = obj.item.all()
        return [row.tag.name for row in rows]

    class Meta:
        model = ClothingItem
        fields = ["id", "name", "category", "description", "image_url", "user", "tags"]
        read_only_fields = ["user"]
