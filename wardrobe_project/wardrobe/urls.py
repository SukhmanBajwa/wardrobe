from rest_framework.routers import DefaultRouter
from .views import ClothingItemViewSet


from django.urls import path

router = DefaultRouter()
router.register(r"clothing_items", ClothingItemViewSet, basename="clothing_item")
urlpatterns = router.urls
