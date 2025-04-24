from rest_framework import serializers
from .models import WardrobeItem, ItemColor, FinalSelection

class WardrobeItemSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = WardrobeItem
        fields = ['id', 'image', 'item_type', 'created_at', 'image_url']

    def get_image_url(self, obj):
        if obj.image:
            # Return only the relative path
            return obj.image.url
        return None
    
# backend/api/serializers.py
class FinalSelectionSerializer(serializers.ModelSerializer):
    top_image = serializers.SerializerMethodField()
    bottom_image = serializers.SerializerMethodField()
    top_colors = serializers.SerializerMethodField()
    bottom_colors = serializers.SerializerMethodField()

    class Meta:
        model = FinalSelection
        fields = ['id', 'top_id', 'bottom_id', 'top_image', 'bottom_image', 
                 'top_colors', 'bottom_colors']

    def get_top_image(self, obj):
        if obj.top and obj.top.image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.top.image.url)
        return None

    def get_bottom_image(self, obj):
        if obj.bottom and obj.bottom.image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.bottom.image.url)
        return None

    def get_top_colors(self, obj):
        return ItemColor.objects.filter(clothing=obj.top).values_list('colour__name', flat=True)

    def get_bottom_colors(self, obj):
        return ItemColor.objects.filter(clothing=obj.bottom).values_list('colour__name', flat=True)