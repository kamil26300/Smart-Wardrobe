# Generated by Django 5.2 on 2025-04-20 19:32

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Colour',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('r', models.IntegerField(validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(255)])),
                ('g', models.IntegerField(validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(255)])),
                ('b', models.IntegerField(validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(255)])),
                ('type', models.CharField(choices=[('TOP', 'Top'), ('BOTTOM', 'Bottom'), ('BOTH', 'Both')], max_length=6)),
            ],
        ),
        migrations.CreateModel(
            name='FinalSelection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('match_strength', models.FloatField(validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(1)])),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('bottom', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bottom_selections', to='api.wardrobeitem')),
                ('top', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='top_selections', to='api.wardrobeitem')),
            ],
            options={
                'ordering': ['-match_strength'],
                'unique_together': {('top', 'bottom')},
            },
        ),
        migrations.CreateModel(
            name='ItemColor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('confidence_score', models.FloatField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(1)])),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('clothing', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='colors', to='api.wardrobeitem')),
                ('colour', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='api.colour')),
            ],
            options={
                'unique_together': {('clothing', 'colour')},
            },
        ),
        migrations.CreateModel(
            name='PredefinedPair',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('bottom_colour', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bottom_pairs', to='api.colour')),
                ('top_colour', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='top_pairs', to='api.colour')),
            ],
            options={
                'unique_together': {('top_colour', 'bottom_colour')},
            },
        ),
    ]
