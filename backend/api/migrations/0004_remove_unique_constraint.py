from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0003_populate_colours'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='predefinedpair',
            unique_together=set(),  # This removes the unique constraint
        ),
    ]