import numpy as np
import pandas as pd
from ..models import Colour

# Changes
# def prepare_color_matrices():
#     """Prepare color matrices from the Colours table"""
#     # Get all colors from database
#     colours = Colour.objects.all().values("id", "name", "type", "r", "g", "b")

#     # Convert to pandas DataFrame
#     color_info = pd.DataFrame(colours)

#     # Create numpy array of RGB values
#     color_matrix = color_info[["r", "g", "b"]].to_numpy()

#     return color_matrix, color_info

from django.core.cache import cache

def prepare_color_matrices():
    """Prepare color matrices with caching"""
    cache_key = 'color_matrices'
    cached_data = cache.get(cache_key)
    
    if cached_data is None:
        colours = Colour.objects.all().values('id', 'name', 'type', 'r', 'g', 'b')
        color_info = pd.DataFrame(colours)
        color_matrix = color_info[['r', 'g', 'b']].to_numpy()
        
        cached_data = (color_matrix, color_info)
        cache.set(cache_key, cached_data, timeout=3600)  # Cache for 1 hour
    
    return cached_data

def get_top_matches_within_threshold(r, g, b, item_type, max_distance=100, top_n=3):
    """Get top N color matches within a threshold distance"""
    # Get color matrices
    color_matrix, color_info = prepare_color_matrices()
    
    # Filter by type
    type_mask = (color_info['type'] == item_type) | (color_info['type'] == 'BOTH')
    color_matrix = color_matrix[type_mask]
    color_info = color_info[type_mask]


    input_color = np.array([r, g, b])

    # Calculate Euclidean distances
    distances = np.linalg.norm(color_matrix - input_color, axis=1)

    # Find indices where distance is below threshold
    match_indices = np.where(distances <= max_distance)[0]

    # Return matched info with distances
    matches = color_info.iloc[match_indices].copy()
    matches["distance"] = distances[match_indices]

    # Sort by distance and return the top N matches
    top_matches = matches.sort_values(by="distance").head(top_n).reset_index(drop=True)

    return top_matches["id"].to_numpy()
