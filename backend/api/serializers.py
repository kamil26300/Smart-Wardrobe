from rest_framework import serializers
from .models import WardrobeItem

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