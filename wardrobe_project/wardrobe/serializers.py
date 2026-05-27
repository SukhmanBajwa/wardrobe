from rest_framework import serializers

from .models import ClothingItem, Category


class ClothingItemSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField(
        many=False
    )  # This will display the category name instead of the ID
    set_category = serializers.CharField(
        write_only=True, required=False
    )  # This will accept the name of category white POST
    tags = serializers.SerializerMethodField()

    categories = Category.objects.all()
    print(categories)

    def get_tags(self, obj):
        rows = obj.item.all()
        return [row.tag.name for row in rows]

    def validate_category(self, value):
        if value not in self.categories:
            raise serializers.ValidationError(
                f"{value} is not found in list of available categories."
            )
        return value

    def create(self, validated_data):
        category_name = validated_data.pop("set_category", None)
        category = Category.objects.get(name=category_name) if category_name else None
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
