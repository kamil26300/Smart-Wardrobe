from django.db import models

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