from django.db import models
from user.models import CustomUser


# Create your models here.
class ClothingItem(models.Model):

    CATEGORY_CHOICES = [
        ("tops", "Tops"),
        ("bottoms", "Bottoms"),
        ("shoes", "Shoes"),
        ("outerwear", "Outerwear"),
        ("accessories", "Accessories"),
    ]

    name = models.CharField(max_length=30)
    category = models.CharField(choices=CATEGORY_CHOICES, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    image_url = models.URLField(null=True, blank=True)
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="user_clothes"
    )

    def __str__(self):
        return f"{self.name}"


class Tag(models.Model):

    SOURCE_CHOICES = [("ml", "ML"), ("user", "User")]
    name = models.CharField(max_length=10)
    source = models.CharField(choices=SOURCE_CHOICES)
    colour_hex = models.CharField(max_length=7, null=True, blank=True)

    def __str__(self):
        return f"{self.name}"


class ClothingItemTag(models.Model):
    pk = models.CompositePrimaryKey("tag", "item")
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, related_name="item_tag")
    item = models.ForeignKey(
        ClothingItem, on_delete=models.CASCADE, related_name="item"
    )


class SavedRecommendation(models.Model):
    share_token = models.CharField(max_length=20, null=True, blank=True)
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="recommendation_user"
    )
    item = models.ForeignKey(
        ClothingItem, on_delete=models.CASCADE, related_name="recommendation_item"
    )
    created_at = models.DateTimeField(auto_now_add=True)


class SavedRecommendationItem(models.Model):
    pk = models.CompositePrimaryKey("recommendation", "item")
    recommendation = models.ForeignKey(
        SavedRecommendation, on_delete=models.CASCADE, related_name="recommendation"
    )
    item = models.ForeignKey(
        ClothingItem,
        on_delete=models.CASCADE,
        related_name="recommendation_item_relation",
    )
    ai_comment = models.TextField(null=True, blank=True)
