from django.contrib import admin

# Register your models here.

from .models import ClothingItem


@admin.register(ClothingItem)
class ClothingItemAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "category", "description", "image_url", "user")
    search_fields = ("id", "name", "category", "description", "image_url", "user")
    list_filter = ("id", "user", "name", "category")
