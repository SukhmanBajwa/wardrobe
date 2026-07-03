from rest_framework.views import APIView
from wardrobe.models import ClothingItem
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from ai_recommendations.models import AiRecommendation
from .serializers import AiRecommendationsSerilizer, AiRecommendationsBackwardSerilizer
from django.core.management import CommandError, call_command


# Create your views here.
class RecommendationsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AiRecommendationsSerilizer

    def get(self, request, item_id=None):
        if item_id:
            item = get_object_or_404(ClothingItem, id=item_id)
            if item.recommendations.exists():

                # get the recommendations for an item
                recommendations = AiRecommendation.objects.filter(
                    item=item,
                    recommended_item__is_deleted=False,
                )

                # get the recommendations where the item in scope is recommended
                # i.e. if item A has been recommended in item B, view of item B should automatically show the item A in recommendation
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

                # removing duplicates, that are created by finding recommendations backwards
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


class RegenerateRecommendationsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, item_id):
        try:
            call_command("recom", request.user.id, "--item_ids", item_id)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CommandError as e:
            error_message, error_status = str(e).split("|")
            return Response(
                {"detail": error_message},
                status=int(error_status),
            )
