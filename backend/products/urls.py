from django.urls import path
from . import views

urlpatterns = [
    path('', views.ProductListView.as_view(), name='product-list'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('sync/', views.sync_products, name='sync-products'),
    path('<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
]
