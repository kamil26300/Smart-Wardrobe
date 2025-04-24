import cv2
import numpy as np
from PIL import Image
import io
from rembg import remove
from sklearn.cluster import MeanShift, estimate_bandwidth

def remove_background_from_file(file_bytes):
    """Remove background from uploaded image (in-memory)"""
    output_data = remove(file_bytes)
    return Image.open(io.BytesIO(output_data)).convert("RGBA")

def convert_to_cv2(pil_img):
    """Convert PIL image to OpenCV format"""
    open_cv_image = np.array(pil_img)
    return cv2.cvtColor(open_cv_image, cv2.COLOR_RGBA2RGB)

def get_dominant_rgb_meanshift(image):
    """Extract dominant color using MeanShift clustering"""
    pixels = image.reshape((-1, 3))
    # Remove black (transparent) pixels
    pixels = pixels[~np.all(pixels == [0, 0, 0], axis=1)]

    if len(pixels) == 0:
        return (0, 0, 0)  # fallback if no valid pixels

    bandwidth = estimate_bandwidth(pixels, quantile=0.1, n_samples=500)
    if bandwidth == 0:
        bandwidth = 1  # fallback if bandwidth estimation fails
        
    ms = MeanShift(bandwidth=bandwidth, bin_seeding=True)
    ms.fit(pixels)

    labels = ms.labels_
    cluster_centers = ms.cluster_centers_

    # Find the largest cluster
    unique, counts = np.unique(labels, return_counts=True)
    dominant_index = np.argmax(counts)
    dominant_color = cluster_centers[dominant_index]

    return tuple(map(int, dominant_color))

def process_uploaded_image(file_bytes):
    """Process uploaded image and return dominant RGB color"""
    try:
        # Remove background
        image_no_bg = remove_background_from_file(file_bytes)
        
        # Convert to CV2 format
        image_cv2 = convert_to_cv2(image_no_bg)
        
        # Get dominant color
        dominant_color = get_dominant_rgb_meanshift(image_cv2)
        
        return dominant_color
        
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return (128, 128, 128)