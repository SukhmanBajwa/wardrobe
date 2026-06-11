from rest_framework import serializers

from wardrobe.serializers import ClothingItemSerializer
from .models import AiRecommendation, AiDescription


class AiRecommendationsSerilizer(serializers.ModelSerializer):
    item = ClothingItemSerializer(read_only=True)
    recommended_item = ClothingItemSerializer(read_only=True)

    class Meta:
        model = AiRecommendation
        fields = [
            "item",
            "recommended_item",
            "reason",
            "best_match",
        ]


class AiRecommendationsBackwardSerilizer(serializers.ModelSerializer):
    item = ClothingItemSerializer(read_only=True)
    recommended_item = ClothingItemSerializer(read_only=True)

    class Meta:
        model = AiRecommendation
        fields = ["item", "recommended_item", "reason", "best_match"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["item"], data["recommended_item"] = data["recommended_item"], data["item"]
        return data
