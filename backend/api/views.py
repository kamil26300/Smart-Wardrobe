import os
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import WardrobeItem
from .serializers import WardrobeItemSerializer
import logging

logger = logging.getLogger(__name__)


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def upload_image(request):
    try:
        print("Received request data:", request.data)  # Debug print

        image = request.FILES.get("image")
        item_type = request.data.get("item_type")

        print(f"Image: {image}, Type: {item_type}")  # Debug print

        if not image:
            return Response(
                {"error": "No image file provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        if not item_type:
            return Response(
                {"error": "No item type provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Create wardrobe item
        wardrobe_item = WardrobeItem.objects.create(image=image, item_type=item_type)

        serializer = WardrobeItemSerializer(wardrobe_item, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Error in upload_image: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def get_wardrobe_items(request):
    try:
        item_type = request.query_params.get("type")
        queryset = WardrobeItem.objects.all()

        if item_type:
            queryset = queryset.filter(item_type=item_type)
        serializer = WardrobeItemSerializer(
            queryset, many=True, context={"request": request}
        )
        return Response(serializer.data)

    except Exception as e:
        logger.error(f"Error in get_wardrobe_items: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
def delete_wardrobe_item(request, item_id):
    try:
        item = WardrobeItem.objects.get(id=item_id)
        
        # Delete the actual image file
        if item.image:
            if os.path.isfile(item.image.path):
                os.remove(item.image.path)
        
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    except WardrobeItem.DoesNotExist:
        return Response(
            {'error': 'Item not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
