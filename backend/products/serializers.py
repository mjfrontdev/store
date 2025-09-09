from rest_framework import serializers
from .models import Product, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']


class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    is_in_stock = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'title', 'description', 'price', 'category', 
            'image', 'rating', 'rating_count', 'stock_quantity',
            'is_in_stock', 'is_active', 'created_at'
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    is_in_stock = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'title', 'description', 'price', 'category', 
            'image', 'rating', 'rating_count', 'stock_quantity',
            'is_in_stock', 'is_active', 'created_at', 'updated_at'
        ]
