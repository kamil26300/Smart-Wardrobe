import os
from django.conf import settings
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import WardrobeItem, Colour, ItemColor
from .serializers import WardrobeItemSerializer
import logging
from .utils.color_processor import process_uploaded_image
from .utils.color_matcher import get_top_matches_within_threshold

logger = logging.getLogger(__name__)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_image(request):
    try:
        print(" Uploading image...")
        image = request.FILES.get('image')
        item_type = request.data.get('item_type')

        if not image or not item_type:
            return Response(
                {'error': 'Image and item type are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create wardrobe item first
        wardrobe_item = WardrobeItem.objects.create(
            image=image,
            item_type=item_type
        )

        # Process the saved image
        try:
            # Get the path to the saved image
            image_path = os.path.join(settings.MEDIA_ROOT, str(wardrobe_item.image))
            
            # Read the saved image file
            with open(image_path, 'rb') as img_file:
                image_bytes = img_file.read()
            
            # Process the image
            dominant_rgb = process_uploaded_image(image_bytes)
            print(f"Dominant RGB: {dominant_rgb}")
            
            # Get top matching colors
            matching_color_ids = get_top_matches_within_threshold(
                r=dominant_rgb[0],
                g=dominant_rgb[1],
                b=dominant_rgb[2],
                item_type=item_type
            )
            
            # Create ItemColor entries
            for color_id in matching_color_ids:
                colour = Colour.objects.get(id=color_id)
                ItemColor.objects.create(
                    clothing=wardrobe_item,
                    colour=colour
                )
                
        except Exception as e:
            logger.error(f"Error processing image colors: {str(e)}")
            logger.error(f"Image path: {image_path}")
            pass

        serializer = WardrobeItemSerializer(
            wardrobe_item,
            context={'request': request}
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"Error in upload_image: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


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


@api_view(["DELETE"])
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
        return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
