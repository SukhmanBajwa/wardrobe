from rest_framework import serializers

from wardrobe.serializers import ClothingItemSerializer
from .models import AiRecommendation, AiDescription


class AiRecommendationsSerilizer(serializers.ModelSerializer):
    recommended_item = ClothingItemSerializer(read_only=True)

    class Meta:
        model = AiRecommendation
        fields = [
            "item",
            "recommended_item",
            "reason",
            "best_match",
        ]
