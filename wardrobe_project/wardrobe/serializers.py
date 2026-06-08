import json

from rest_framework import serializers

from .models import ClothingItem, Category, ClothingItemTag, Tag


class ClothingItemSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField(
        many=False
    )  # This will display the category name instead of the ID
    category_name = serializers.CharField(
        write_only=True, required=False
    )  # This will accept the name of category white POST
    tags = serializers.SerializerMethodField()
    new_tags = serializers.CharField(write_only=True, required=False)
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None

    def get_tags(self, obj):
        rows = obj.tagged_item.all()
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

    def update(self, instance, validated_data):
        print("UPDATE CALLED")
        print("validated_data:", validated_data)
        print("instance before:", instance.name, instance.category)
        category_name = validated_data.pop("category_name", None)
        new_tags_json = validated_data.pop("new_tags", None)
        new_tags_loaded = json.loads(new_tags_json) if new_tags_json else None
        print(new_tags_loaded)

        if category_name:
            instance.category = Category.objects.get(name=category_name)

        if new_tags_loaded is not None:
            current_tags = instance.tagged_item.all()
            for tag in new_tags_loaded:
                if tag not in current_tags:
                    newly_created_tag, _ = Tag.objects.get_or_create(
                        name=tag, user=instance.user, defaults={"source": "user"}
                    )
                    ClothingItemTag.objects.create(item=instance, tag=newly_created_tag)

        instance.name = validated_data.get("name", instance.name)
        instance.description = validated_data.get("description", instance.description)
        instance.image = validated_data.get("image", instance.image)

        instance.save()
        return instance

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
            "new_tags",
        ]
        read_only_fields = ["user"]
        write_only_fields = ["is_deleted"]


class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]
