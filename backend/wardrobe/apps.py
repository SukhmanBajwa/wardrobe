from django.apps import AppConfig


class WardrobeConfig(AppConfig):
    name = "wardrobe"

    def ready(self):
        import wardrobe.signals
