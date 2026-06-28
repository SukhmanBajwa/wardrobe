from django.apps import AppConfig


class UserConfig(AppConfig):
    name = "user"

    # signal registration
    def ready(self):
        import user.signals
