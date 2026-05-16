from django.urls import path
from .views import RecommendationsAPIView

urlpatterns = [
    path('ai_rec/<int:id>/', RecommendationsAPIView.as_view(), name="ai_rec")
]