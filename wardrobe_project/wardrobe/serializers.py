from rest_framework import serializers

from .models import ClothingItem, Category


class ClothingItemSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField(
        many=False
    )  # This will display the category name instead of the ID
    set_category = serializers.IntegerField(
        write_only=True, required=False
    )  # This will accept the name of category white POST
    tags = serializers.SerializerMethodField()

    def get_tags(self, obj):
        rows = obj.item.all()
        return [row.tag.name for row in rows]

    def validate_set_category(self, value):
        if not Category.objects.filter(id=value).exists():
            raise serializers.ValidationError(
                f"{value} is not found in list of available categories."
            )
        return value

    def create(self, validated_data):
        category_id = validated_data.pop("set_category", None)
        category = Category.objects.get(id=category_id) if category_id else None
        return ClothingItem.objects.create(category=category, **validated_data)

    class Meta:
        model = ClothingItem
        fields = [
            "id",
            "name",
            "category",
            "set_category",
            "description",
            "image_url",
            "user",
            "tags",
        ]
        read_only_fields = ["user"]


class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]
