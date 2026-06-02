from rest_framework import serializers

from .models import ClothingItem, Category


class ClothingItemSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField(
        many=False
    )  # This will display the category name instead of the ID
    category_name = serializers.CharField(
        write_only=True, required=False
    )  # This will accept the name of category white POST
    tags = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None

    def get_tags(self, obj):
        rows = obj.item.all()
        return [row.tag.name for row in rows]

    def validate_category_name(self, value):
        if not Category.objects.filter(name=value).exists():
            raise serializers.ValidationError(
                f"{value} is not found in list of available categories."
            )
        return value

    def create(self, validated_data):
        category_name = validated_data.pop("category_name", None)
        category = Category.objects.get(name=category_name) if category_name else None
        return ClothingItem.objects.create(category=category, **validated_data)

    class Meta:
        model = ClothingItem

        fields = [
            "id",
            "name",
            "category",
            "category_name",
            "description",
            "image",
            "image_url",
            "user",
            "tags",
        ]
        read_only_fields = ["user"]
        write_only_fields = ["is_deleted"]


class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]
