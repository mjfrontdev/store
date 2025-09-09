from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q
from decimal import Decimal
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer, UpdateOrderStatusSerializer
from cart.models import Cart, CartItem


class OrderListView(generics.ListAPIView):
    """List user's orders"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


class OrderDetailView(generics.RetrieveAPIView):
    """Retrieve a single order"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    lookup_url_kwarg = 'order_id'
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


@api_view(['POST'])
def create_order(request):
    """Create a new order from cart"""
    serializer = CreateOrderSerializer(data=request.data)
    if serializer.is_valid():
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate totals
        subtotal = sum(item.total_price for item in cart.items.all())
        shipping_cost = Decimal('10.00')  # Fixed shipping cost
        tax_amount = subtotal * Decimal('0.09')  # 9% tax
        total_amount = subtotal + shipping_cost + tax_amount
        
        # Create order
        order = Order.objects.create(
            user=request.user,
            shipping_address=serializer.validated_data['shipping_address'],
            shipping_city=serializer.validated_data['shipping_city'],
            shipping_postal_code=serializer.validated_data['shipping_postal_code'],
            shipping_phone=serializer.validated_data.get('shipping_phone', ''),
            payment_method=serializer.validated_data['payment_method'],
            notes=serializer.validated_data.get('notes', ''),
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            tax_amount=tax_amount,
            total_amount=total_amount
        )
        
        # Create order items
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.price
            )
        
        # Clear cart
        cart.items.all().delete()
        
        return Response({
            'message': 'Order created successfully',
            'order': OrderSerializer(order).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def process_payment(request, order_id):
    """Process payment for an order (mock implementation)"""
    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if order.payment_status == 'paid':
        return Response({'error': 'Order already paid'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Mock payment processing
    # In a real implementation, you would integrate with payment gateways like ZarinPal or Stripe
    payment_id = f"PAY_{order.order_number}_{order.id}"
    
    order.payment_id = payment_id
    order.payment_status = 'paid'
    order.status = 'processing'
    order.save()
    
    return Response({
        'message': 'Payment processed successfully',
        'payment_id': payment_id,
        'order': OrderSerializer(order).data
    })


@api_view(['PUT'])
def update_order_status(request, order_id):
    """Update order status (admin only)"""
    serializer = UpdateOrderStatusSerializer(data=request.data)
    if serializer.is_valid():
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        
        order.status = serializer.validated_data['status']
        if 'notes' in serializer.validated_data:
            order.notes = serializer.validated_data['notes']
        order.save()
        
        return Response({
            'message': 'Order status updated successfully',
            'order': OrderSerializer(order).data
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def search_order(request):
    """Search for an order by order number"""
    order_number = request.GET.get('order_number', '').strip()
    
    if not order_number:
        return Response({'error': 'Order number is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Try to find order by order_number field first
        order = Order.objects.get(order_number=order_number, user=request.user)
    except Order.DoesNotExist:
        try:
            # Try to find by ID if order_number is numeric
            if order_number.isdigit():
                order = Order.objects.get(id=int(order_number), user=request.user)
            else:
                # Try to extract ID from ORD-XXXXX format
                if order_number.upper().startswith('ORD-'):
                    order_id = order_number.upper().replace('ORD-', '')
                    if order_id.isdigit():
                        order = Order.objects.get(id=int(order_id), user=request.user)
                    else:
                        # Try to find by partial match in order_number
                        order = Order.objects.filter(
                            Q(order_number__icontains=order_number) | 
                            Q(order_number__icontains=order_id)
                        ).filter(user=request.user).first()
                else:
                    # Try partial match
                    order = Order.objects.filter(
                        Q(order_number__icontains=order_number) |
                        Q(id__icontains=order_number)
                    ).filter(user=request.user).first()
        except (Order.DoesNotExist, ValueError):
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if not order:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    
    return Response(OrderSerializer(order).data)
