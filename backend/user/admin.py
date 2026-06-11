from django.contrib import admin

# Register your models here.

from .models import CustomUser


@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "first_name", "last_name", "email", "status")
    search_fields = ("username", "first_name", "last_name", "email", "status")
    list_filter = ("username", "first_name", "last_name")
