from django.db import migrations
import pandas as pd
import os

def reset_and_populate_pairs(apps, schema_editor):
    # Get the models
    PredefinedPair = apps.get_model('api', 'PredefinedPair')
    Colour = apps.get_model('api', 'Colour')
    
    # Clear existing data
    PredefinedPair.objects.all().delete()
    print("Cleared all existing predefined pairs")
    
    # Reset the sequence for id to start from 1
    schema_editor.execute("ALTER SEQUENCE api_predefinedpair_id_seq RESTART WITH 1")
    print("Reset ID sequence to 1")
    
    # Get the path to the Excel file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    excel_path = os.path.join(current_dir, '..', 'data', 'predefined_pairs.xlsx')
    
    try:
        # Read the Excel file
        df = pd.read_excel(excel_path)
        print(f"Read {len(df)} pairs from Excel file")
        
        # Create pairs
        for _, row in df.iterrows():
            top_id = int(row['top_colour'])
            bottom_id = int(row['bottom_colour'])
            
            # Create the pair
            PredefinedPair.objects.create(
                top_colour_id=top_id,
                bottom_colour_id=bottom_id
            )
        
        # Verify the results
        total_pairs = PredefinedPair.objects.count()
        first_pair = PredefinedPair.objects.first()
        last_pair = PredefinedPair.objects.last()
        
        print(f"Successfully added {total_pairs} pairs")
        print(f"First pair ID: {first_pair.id}")
        print(f"Last pair ID: {last_pair.id}")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise

def reverse_migration(apps, schema_editor):
    PredefinedPair = apps.get_model('api', 'PredefinedPair')
    PredefinedPair.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0004_remove_unique_constraint'),  # Make sure this points to the previous migration
    ]

    operations = [
        migrations.RunPython(reset_and_populate_pairs, reverse_migration)
    ]