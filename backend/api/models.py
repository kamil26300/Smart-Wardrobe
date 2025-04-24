from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import os

class WardrobeItem(models.Model):
    ITEM_TYPES = (
        ('TOP', 'Top'),
        ('BOTTOM', 'Bottom'),
    )
    
    image = models.ImageField(upload_to='wardrobe/')
    item_type = models.CharField(max_length=6, choices=ITEM_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.item_type} - {self.created_at}"

    def delete(self, *args, **kwargs):
        if self.image:
            if os.path.isfile(self.image.path):
                os.remove(self.image.path)
        super().delete(*args, **kwargs)

class Colour(models.Model):
    TYPE_CHOICES = (
        ('TOP', 'Top'),
        ('BOTTOM', 'Bottom'),
        ('BOTH', 'Both'),
    )
    
    name = models.CharField(max_length=50)
    r = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(255)])
    g = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(255)])
    b = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(255)])
    type = models.CharField(max_length=6, choices=TYPE_CHOICES)

    def __str__(self):
        return f"{self.name} ({self.r},{self.g},{self.b})"

class PredefinedPair(models.Model):
    top_colour = models.ForeignKey(
        Colour, 
        on_delete=models.CASCADE,
        related_name='top_pairs'
    )
    bottom_colour = models.ForeignKey(
        Colour, 
        on_delete=models.CASCADE,
        related_name='bottom_pairs'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['top_colour', 'bottom_colour']

    def __str__(self):
        return f"{self.top_colour.name} - {self.bottom_colour.name}"

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.top_colour.type not in ['TOP', 'BOTH']:
            raise ValidationError('Top colour must be of type TOP or BOTH')
        if self.bottom_colour.type not in ['BOTTOM', 'BOTH']:
            raise ValidationError('Bottom colour must be of type BOTTOM or BOTH')

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

class ItemColor(models.Model):
    clothing = models.ForeignKey(
        WardrobeItem,  # Updated to reference WardrobeItem
        on_delete=models.CASCADE,
        related_name='colors'
    )
    colour = models.ForeignKey(
        Colour, 
        on_delete=models.CASCADE,
        related_name='items'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['clothing', 'colour']

    def __str__(self):
        return f"{self.clothing.item_type} - {self.colour.name}"

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.colour.type not in [self.clothing.item_type, 'BOTH']:
            raise ValidationError('Colour type must match clothing type or be BOTH')

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

class FinalSelection(models.Model):
    top = models.ForeignKey(
        WardrobeItem,  # Updated to reference WardrobeItem
        on_delete=models.CASCADE,
        related_name='top_selections'
    )
    bottom = models.ForeignKey(
        WardrobeItem,  # Updated to reference WardrobeItem
        on_delete=models.CASCADE,
        related_name='bottom_selections'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['top', 'bottom']

    def __str__(self):
        return f"Match: {self.top.id} - {self.bottom.id})"

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.top.item_type != 'TOP':  # Updated to use item_type
            raise ValidationError('First item must be a top')
        if self.bottom.item_type != 'BOTTOM':  # Updated to use item_type
            raise ValidationError('Second item must be a bottom')

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)