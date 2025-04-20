from django.contrib import admin
from .models import WardrobeItem

@admin.register(WardrobeItem)
class WardrobeItemAdmin(admin.ModelAdmin):
    list_display = ('item_type', 'created_at')
    list_filter = ('item_type',)