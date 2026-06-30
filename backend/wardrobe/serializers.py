import json

from rest_framework import serializers

from .models import ClothingItem, Category, ClothingItemTag, Tag


class ClothingItemSerializer(serializers.ModelSerializer):
    # Below StringRelatedField calls the str() on model: Category, and in category model __str__ return the name
    category = serializers.StringRelatedField(many=False)
    # Below accepts string of chars and only writes to it.
    category_name = serializers.CharField(write_only=True, required=False)
    # Below SerializerMethodField expects a method name get_tags to compute the value of tags
    tags = serializers.SerializerMethodField()

    new_tags = serializers.CharField(write_only=True, required=False)
    # Expect method named get_image_url to compute value for image_url
    image_url = serializers.SerializerMethodField()

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None

    def get_tags(self, obj):
        rows = obj.tagged_item.all()
        return [row.tag.name for row in rows]

    def validate_category_name(self, value):
        user = self.context["request"].user
        if not Category.objects.filter(name=value, user=user).exists():
            raise serializers.ValidationError(
                f"{value} is not found in list of available categories."
            )
        return value

    def handle_tags(self, item, new_tags_json):
        ###Creates tags and links them to the item"""
        if not new_tags_json:
            return
        for tag_name in json.loads(new_tags_json):
            tag, _ = Tag.objects.get_or_create(
                name=tag_name, user=item.user, defaults={"source": "user"}
            )
            ClothingItemTag.objects.get_or_create(item=item, tag=tag)

    def create(self, validated_data):
        category_name = validated_data.pop("category_name", None)
        user = validated_data.get("user")
        category = (
            Category.objects.get(name=category_name, user=user)
            if category_name
            else None
        )
        new_tags_json = validated_data.pop("new_tags", None)
        instance = ClothingItem.objects.create(category=category, **validated_data)
        self.handle_tags(instance, new_tags_json)

        return instance

    def update(self, instance, validated_data):
        print("UPDATE CALLED")
        print("validated_data:", validated_data)
        print("instance before:", instance.name, instance.category)
        category_name = validated_data.pop("category_name", None)

        if category_name:
            instance.category = Category.objects.get(
                name=category_name, user=instance.user
            )

        self.handle_tags(instance, validated_data.pop("new_tags", None))

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

        read_only_tags = ["user"]


class TagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name", "source"]

        read_only_tags = ["user"]
