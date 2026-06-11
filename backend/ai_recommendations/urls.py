from django.urls import path
from .views import RecommendationsAPIView

urlpatterns = [
    path("ai_req/<int:item_id>/", RecommendationsAPIView.as_view(), name="ai_req")
]
