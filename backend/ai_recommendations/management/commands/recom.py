from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from ai_recommendations.models import AiRecommendation
from wardrobe.models import ClothingItem
from wardrobe.serializers import ClothingItemSerializer
from ai_recommendations import services


class Command(BaseCommand):
    help = """Regenerate AI recommendations for a user's clothing items, eg cmd py manage.py recom 6
        py manage.py recom 6 --item_ids 37 4 16"""

    def add_arguments(self, parser):
        parser.add_argument("user_id", type=int, help="User ID")
        parser.add_argument(
            "--item_ids",
            nargs="*",
            help="Item IDs to regenerate (omit for all items)",
        )

    def handle(self, *args, **options):
        user_id = options["user_id"]
        item_ids = options["item_ids"]

        items = self._get_items(user_id, item_ids)
        inventory = self._get_inventory(user_id)

        for item in items:
            self._generate_for_item(item, inventory)
            self.stdout.write(f"  ✓ {item.name}")

        self.stdout.write(
            self.style.SUCCESS(
                f"Done. Generated recommendations for {items.count()} items."
            )
        )

    def _get_items(self, user_id, item_ids):
        """Returns the queryset of items to process."""
        queryset = ClothingItem.objects.filter(user=user_id, is_deleted=False)
        if item_ids:
            queryset = queryset.filter(id__in=[int(i) for i in item_ids])
        return queryset

    def _get_inventory(self, user_id):
        """Returns serialized inventory for a user."""
        return ClothingItemSerializer(
            ClothingItem.objects.filter(user=user_id, is_deleted=False),
            many=True,
        ).data

    def _generate_for_item(self, item, inventory):
        """Deletes existing recommendations for item and generates new ones."""
        AiRecommendation.objects.filter(item=item).delete()
        item_info = ClothingItemSerializer(item).data
        ai_reply, _ = services.Ai_Recommendation(item_info, inventory)
        services.Save_Ai_Recommendations(item.id, ai_reply)
