# Signal to run when new use is created

from django.db.models.signals import post_save
from django.dispatch import receiver
from user.models import CustomUser
from wardrobe.models import Category


# signal to create default categoriess
@receiver(post_save, sender=CustomUser)
def call_default_categories(sender, instance, created, **kwargs):
    DEFAULT_CATEGORIES = [
        "tops",
        "bottoms",
        "outerwear",
        "shoes",
        "accessories",
    ]
    if created:
        print("Default categories made")
        for category in DEFAULT_CATEGORIES:
            Category.objects.get_or_create(name=category, user=instance)
