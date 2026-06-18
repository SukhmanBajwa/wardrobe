from rest_framework.routers import DefaultRouter
from .views import ClothingItemViewSet, ClothesCategoriesViewSet, TagsViewSet


from django.urls import path

# using router to get al crud links automatically
router = DefaultRouter()
router.register(r"clothing_items", ClothingItemViewSet, basename="clothing_items")
router.register(r"categories", ClothesCategoriesViewSet, basename="categories")
router.register(r"tags", TagsViewSet, basename="tags")
urlpatterns = router.urls
