from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductListSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price', 'total_price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'payment_status', 'payment_method',
            'shipping_address', 'shipping_city', 'shipping_postal_code', 'shipping_phone',
            'subtotal', 'shipping_cost', 'tax_amount', 'total_amount', 'notes',
            'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'order_number', 'created_at', 'updated_at']


class CreateOrderSerializer(serializers.Serializer):
    shipping_address = serializers.CharField()
    shipping_city = serializers.CharField()
    shipping_postal_code = serializers.CharField()
    shipping_phone = serializers.CharField(required=False, allow_blank=True)
    payment_method = serializers.CharField()
    notes = serializers.CharField(required=False, allow_blank=True)


class UpdateOrderStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Order.STATUS_CHOICES)
    notes = serializers.CharField(required=False, allow_blank=True)
