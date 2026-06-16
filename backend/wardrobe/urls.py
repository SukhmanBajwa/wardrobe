from rest_framework.routers import DefaultRouter
from .views import ClothingItemViewSet, ClothesCategoriesViewSet


from django.urls import path

# using router to get al crud links automatically
router = DefaultRouter()
router.register(r"clothing_items", ClothingItemViewSet, basename="clothing_item")
router.register(r"categories", ClothesCategoriesViewSet, basename="categories")
urlpatterns = router.urls
