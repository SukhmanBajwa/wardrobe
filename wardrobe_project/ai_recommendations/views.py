from rest_framework.views import APIView
from wardrobe.models import ClothingItem
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Q

from ai_recommendations.models import AiRecommendation
from .serializers import AiRecommendationsSerilizer, AiRecommendationsBackwardSerilizer


# Create your views here.
class RecommendationsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AiRecommendationsSerilizer

    def get(self, request, item_id=None):
        if item_id:
            item = get_object_or_404(ClothingItem, id=item_id)
            if item.recommendations.exists():
                recommendations = AiRecommendation.objects.filter(
                    item=item,
                    recommended_item__is_deleted=False,
                )
                recommendations_backwards = AiRecommendation.objects.filter(
                    recommended_item=item,
                    recommended_item__is_deleted=False,
                )
                forward_data = AiRecommendationsSerilizer(
                    recommendations, many=True
                ).data
                backwards_data = AiRecommendationsBackwardSerilizer(
                    recommendations_backwards, many=True
                ).data

                seen = set()
                unique = []

                for r in list(forward_data) + list(backwards_data):
                    rec_id = r["recommended_item"]["id"]
                    if rec_id not in seen:
                        seen.add(rec_id)
                        unique.append(r)

                return Response(
                    unique,
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {"Please provide item ID"}, status=status.HTTP_406_NOT_ACCEPTABLE
            )

        return Response(
            [],
            status=status.HTTP_200_OK,
        )
