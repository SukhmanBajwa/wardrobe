import threading

from django.db.models.signals import post_save
from django.dispatch import receiver

from ai_recommendations import services
from wardrobe.serializers import ClothingItemSerializer
from .models import ClothingItem


# signal to create default categoriess
@receiver(post_save, sender=ClothingItem)
def generate_recommendations_on_create(sender, instance, created, **kwargs):
    if created:

        def run():
            item_info = ClothingItemSerializer(instance).data
            inventory_data = ClothingItemSerializer(
                ClothingItem.objects.filter(user=instance.user, is_deleted=False),
                many=True,
            ).data
            ai_reply, response_status = services.Ai_Recommendation(
                item_info, inventory_data
            )
            if response_status == 200:
                services.Save_Ai_Recommendations(instance.id, ai_reply)

        thread = threading.Thread(target=run)
        thread.daemon = True
        thread.start()
