from django.contrib import admin
from .models import WardrobeItem, Colour, PredefinedPair, ItemColor, FinalSelection

@admin.register(WardrobeItem)
class WardrobeItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'item_type', 'created_at')
    list_filter = ('item_type',)
    search_fields = ('item_type',)

@admin.register(Colour)
class ColourAdmin(admin.ModelAdmin):
    list_display = ('name', 'r', 'g', 'b', 'type')
    list_filter = ('type',)
    search_fields = ('name',)

@admin.register(PredefinedPair)
class PredefinedPairAdmin(admin.ModelAdmin):
    list_display = ('top_colour', 'bottom_colour', 'created_at')
    list_filter = ('top_colour', 'bottom_colour')

@admin.register(ItemColor)
class ItemColorAdmin(admin.ModelAdmin):
    list_display = ('clothing', 'colour', 'created_at')
    list_filter = ('colour', 'clothing__item_type')  # Updated to use item_type
    search_fields = ('colour__name',)

@admin.register(FinalSelection)
class FinalSelectionAdmin(admin.ModelAdmin):
    list_display = ('top', 'bottom', 'match_strength', 'created_at')
    list_filter = ('match_strength',)
    ordering = ('-match_strength',)