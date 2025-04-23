from django.db import migrations
import csv
import os

def populate_colours(apps, schema_editor):
    # Get the Colour model
    Colour = apps.get_model('api', 'Colour')
    
    # Get the path to the CSV file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, '..', 'data', 'colours.csv')
    
    try:
        colours_to_create = []
        
        # Read the CSV file
        with open(csv_path, 'r') as file:
            # Skip the header row
            next(file)
            
            # Read the data rows
            csv_reader = csv.reader(file, delimiter=' ')
            for row in csv_reader:
                # Validate RGB values
                row = row[0].split(",")
                r, g, b = int(row[3]), int(row[4]), int(row[5])
                if not all(0 <= value <= 255 for value in [r, g, b]):
                    print(f"Skipping row with invalid RGB values: {row}")
                    continue

                # Validate type
                if row[2] not in ['TOP', 'BOTTOM', 'BOTH']:
                    print(f"Skipping row with invalid type: {row}")
                    continue

                colour = Colour(
                    id=int(row[0]),
                    name=row[1],
                    type=row[2],
                    r=r,
                    g=g,
                    b=b
                )
                colours_to_create.append(colour)
        
        # Bulk create all colours
        Colour.objects.bulk_create(colours_to_create)
        
        print(f"Successfully added {len(colours_to_create)} colours to the database")
        
    except Exception as e:
        print(f"Error populating colours: {str(e)}")
        raise

def reverse_populate_colours(apps, schema_editor):
    # Get the Colour model
    Colour = apps.get_model('api', 'Colour')
    # Delete all colours
    Colour.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0002_colour_finalselection_itemcolor_predefinedpair'),  # Replace with your previous migration
    ]

    operations = [
        migrations.RunPython(populate_colours, reverse_populate_colours),
    ]