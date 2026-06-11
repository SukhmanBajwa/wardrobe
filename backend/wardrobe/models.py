from django.db import models
from user.models import CustomUser
from cloudinary.models import CloudinaryField


# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=20)
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="user_category"
    )

    class Meta:
        unique_together = ["name", "user"]

    def __str__(self):
        return f"{self.name}"


class ClothingItem(models.Model):

    name = models.CharField(max_length=30)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True
    )
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to="clothing/", blank=True, max_length=500)
    # image_url = models.URLField(null=True, blank=True)
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="user_clothes"
    )
    is_deleted = models.BooleanField(null=False, blank=False, default=False)

    def __str__(self):
        return f"{self.name}"


class Tag(models.Model):

    SOURCE_CHOICES = [("ml", "ML"), ("user", "User")]
    name = models.CharField(max_length=10)
    source = models.CharField(choices=SOURCE_CHOICES)
    colour_hex = models.CharField(max_length=7, null=True, blank=True)
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="user_tags"
    )

    class Meta:
        unique_together = ["name", "user"]

    def __str__(self):
        return f"{self.name}"


class ClothingItemTag(models.Model):
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, related_name="item_tag")
    item = models.ForeignKey(
        ClothingItem, on_delete=models.CASCADE, related_name="tagged_item"
    )

    def __str__(self):
        return f"{self.tag.name}"
