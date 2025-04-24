# backend/api/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_image, name='upload_image'),
    path('wardrobe-items/', views.get_wardrobe_items, name='get_wardrobe_items'),
    path('wardrobe-items/<str:item_id>', views.delete_wardrobe_item, name='delete_wardrobe_item'),
    path('final-selections/', views.get_final_selections, name='final-selections'),
    path('delete-all/<str:item_type>/', views.delete_all_items, name='delete-all-items'),
]