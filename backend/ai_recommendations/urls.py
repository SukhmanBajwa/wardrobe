from django.urls import path
from .views import RecommendationsAPIView, RegenerateRecommendationsAPIView

urlpatterns = [
    path("ai_req/<int:item_id>/", RecommendationsAPIView.as_view(), name="ai_req"),
    path(
        "ai_req_refresh/<int:item_id>/",
        RegenerateRecommendationsAPIView.as_view(),
        name="ai_req_refresh",
    ),
]
