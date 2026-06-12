from django.urls import path
from .views import RecommendationsAPIView, RegenerateRecommendations

urlpatterns = [
    path("ai_req/<int:item_id>/", RecommendationsAPIView.as_view(), name="ai_req"),
    path(
        "ai_req_refresh/<int:item_id>/",
        RegenerateRecommendations.as_view(),
        name="ai_req_refresh",
    ),
]
