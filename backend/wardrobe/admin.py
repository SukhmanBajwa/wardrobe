from django.contrib import admin

# Register your models here.

from .models import ClothingItem, ClothingItemTag, Tag


class ClothingItemTagInline(admin.TabularInline):
    model = ClothingItemTag
    extra = 1


@admin.register(ClothingItem)
class ClothingItemAdmin(admin.ModelAdmin):

    def tags(self, obj):
        return [row.tag.name for row in obj.item.all()]

    inlines = [ClothingItemTagInline]

    list_display = (
        "id",
        "name",
        "category",
        "tags",
        "description",
        "image",
        "user",
    )
    search_fields = (
        "id",
        "name",
        "category",
        "description",
        "image",
        "user",
    )
    list_filter = ("id", "user", "name", "category")


@admin.register(Tag)
class TagsAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "source", "colour_hex")
    search_fields = ("id", "name", "source", "colour_hex")
    list_filter = ("id", "name", "source", "colour_hex")
