from django.db import models


# Create your models here.
class AiDescription(models.Model):
    item = models.OneToOneField("wardrobe.ClothingItem", on_delete=models.CASCADE)
    description = models.TextField()

    def __str__(self):
        return f"AI Description for {self.item.name}"


class AiRecommendation(models.Model):
    item = models.ForeignKey(
        "wardrobe.ClothingItem",
        on_delete=models.CASCADE,
        related_name="recommendations",
    )
    recommended_item = models.ForeignKey(
        "wardrobe.ClothingItem", on_delete=models.CASCADE, related_name="recommended_by"
    )
    reason = models.TextField()

    def __str__(self):
        return f"Recommendation: {self.item.name} -> {self.recommended_item.name}"
