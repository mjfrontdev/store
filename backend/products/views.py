from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.core.cache import cache
import requests
from django.conf import settings
from .models import Product, Category
from .serializers import ProductListSerializer, ProductDetailSerializer, CategorySerializer


class ProductListView(generics.ListAPIView):
    """List all products with filtering and search"""
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['title', 'description']
    ordering_fields = ['price', 'rating', 'created_at']
    ordering = ['-created_at']


class ProductDetailView(generics.RetrieveAPIView):
    """Retrieve a single product"""
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]


class CategoryListView(generics.ListAPIView):
    """List all categories"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


@api_view(['POST'])
def sync_products(request):
    """Sync products from FakeStore API"""
    try:
        # Get products from FakeStore API with proper headers
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(f"{settings.FAKESTORE_API_URL}/products", headers=headers, timeout=10)
        response.raise_for_status()
        products_data = response.json()
        
        # Get categories
        categories_response = requests.get(f"{settings.FAKESTORE_API_URL}/products/categories", headers=headers, timeout=10)
        categories_response.raise_for_status()
        categories_data = categories_response.json()
        
        # Create categories
        category_mapping = {}
        for cat_name in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_name,
                defaults={'slug': cat_name.lower().replace(' ', '-')}
            )
            category_mapping[cat_name] = category
        
        # Create or update products
        created_count = 0
        updated_count = 0
        
        for product_data in products_data:
            category_name = product_data.get('category', 'uncategorized')
            category = category_mapping.get(category_name)
            
            if not category:
                category = Category.objects.create(
                    name=category_name,
                    slug=category_name.lower().replace(' ', '-')
                )
                category_mapping[category_name] = category
            
            product, created = Product.objects.update_or_create(
                title=product_data['title'],
                defaults={
                    'description': product_data.get('description', ''),
                    'price': product_data.get('price', 0),
                    'category': category,
                    'image': product_data.get('image', ''),
                    'rating': product_data.get('rating', {}).get('rate', 0),
                    'rating_count': product_data.get('rating', {}).get('count', 0),
                    'stock_quantity': 100,  # Default stock
                    'is_active': True
                }
            )
            
            if created:
                created_count += 1
            else:
                updated_count += 1
        
        # Clear cache
        cache.clear()
        
        return Response({
            'message': 'Products synced successfully',
            'created': created_count,
            'updated': updated_count,
            'total': len(products_data)
        }, status=status.HTTP_200_OK)
        
    except requests.RequestException as e:
        # If API fails, create some sample products
        return create_sample_products()
    except Exception as e:
        return Response({
            'error': f'An error occurred: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def create_sample_products():
    """Create sample products when API is not available"""
    try:
        # Sample categories
        categories_data = [
            "electronics", "jewelery", "men's clothing", "women's clothing"
        ]
        
        # Sample products
        products_data = [
            {
                "title": "گوشی موبایل سامسونگ گلکسی A54",
                "price": 12990000,
                "description": "گوشی موبایل سامسونگ گلکسی A54 با دوربین 50 مگاپیکسلی و باتری 5000 میلی‌آمپر",
                "category": "electronics",
                "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
                "rating": {"rate": 4.5, "count": 120}
            },
            {
                "title": "لپ‌تاپ اپل مک‌بوک پرو 13",
                "price": 45000000,
                "description": "لپ‌تاپ اپل مک‌بوک پرو 13 اینچ با پردازنده M2 و 8 گیگابایت رم",
                "category": "electronics",
                "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
                "rating": {"rate": 4.8, "count": 89}
            },
            {
                "title": "ساعت هوشمند اپل واچ",
                "price": 8500000,
                "description": "ساعت هوشمند اپل واچ سری 8 با قابلیت‌های سلامتی و ورزشی",
                "category": "electronics",
                "image": "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400",
                "rating": {"rate": 4.6, "count": 156}
            },
            {
                "title": "کفش ورزشی نایک",
                "price": 3200000,
                "description": "کفش ورزشی نایک ایر مکس با طراحی مدرن و راحتی بالا",
                "category": "men's clothing",
                "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
                "rating": {"rate": 4.4, "count": 203}
            },
            {
                "title": "کیف دستی زنانه چرمی",
                "price": 1800000,
                "description": "کیف دستی زنانه چرمی با طراحی شیک و کیفیت عالی",
                "category": "women's clothing",
                "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
                "rating": {"rate": 4.7, "count": 78}
            },
            {
                "title": "دستبند طلا 18 عیار",
                "price": 12000000,
                "description": "دستبند طلا 18 عیار با طراحی کلاسیک و زیبا",
                "category": "jewelery",
                "image": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
                "rating": {"rate": 4.9, "count": 45}
            }
        ]
        
        # Create categories
        category_mapping = {}
        for cat_name in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_name,
                defaults={'slug': cat_name.lower().replace(' ', '-')}
            )
            category_mapping[cat_name] = category
        
        # Create products
        created_count = 0
        updated_count = 0
        
        for product_data in products_data:
            category_name = product_data.get('category', 'uncategorized')
            category = category_mapping.get(category_name)
            
            if not category:
                category = Category.objects.create(
                    name=category_name,
                    slug=category_name.lower().replace(' ', '-')
                )
                category_mapping[category_name] = category
            
            product, created = Product.objects.update_or_create(
                title=product_data['title'],
                defaults={
                    'description': product_data.get('description', ''),
                    'price': product_data.get('price', 0),
                    'category': category,
                    'image': product_data.get('image', ''),
                    'rating': product_data.get('rating', {}).get('rate', 0),
                    'rating_count': product_data.get('rating', {}).get('count', 0),
                    'stock_quantity': 100,
                    'is_active': True
                }
            )
            
            if created:
                created_count += 1
            else:
                updated_count += 1
        
        return Response({
            'message': 'Sample products created successfully',
            'created': created_count,
            'updated': updated_count,
            'total': len(products_data)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Failed to create sample products: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
