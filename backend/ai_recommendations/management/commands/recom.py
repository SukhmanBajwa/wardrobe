import time
from django.core.management.base import BaseCommand
from wardrobe.models import ClothingItem
from wardrobe.serializers import ClothingItemSerializer
from ai_recommendations import services


class Command(BaseCommand):
    help = """Regenerate AI recommendations for a user's clothing items, like: py manage.py <user_id> <optional: <item_id>> eg cmd: py manage.py recom 6
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
            error, response_status = services.generate_and_save_recommendations(
                item, inventory_data=inventory
            )
            if error:
                self.stderr.write(f"  ✗ {item.name}: {error}")
            else:
                self.stdout.write(f"  ✓ {item.name}")
            time.sleep(2)

        self.stdout.write(
            self.style.SUCCESS(
                f"Done. Processed recommendations for {items.count()} items."
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
