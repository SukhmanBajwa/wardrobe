from rest_framework.views import APIView
from wardrobe.models import ClothingItem
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import AiRecommendationsSerilizer


# Create your views here.
class RecommendationsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AiRecommendationsSerilizer

    def get(self, request, item_id=None):
        if item_id:
            item = get_object_or_404(ClothingItem, id=item_id)
            if item.recommendations.exists():
                recommendations = item.recommendations.filter(
                    recommended_item__is_deleted=False
                )
                if recommendations:
                    return Response(
                        AiRecommendationsSerilizer(recommendations, many=True).data,
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
