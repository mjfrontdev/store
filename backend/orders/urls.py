from django.urls import path
from . import views

urlpatterns = [
    path('', views.OrderListView.as_view(), name='order-list'),
    path('create/', views.create_order, name='create-order'),
    path('search/', views.search_order, name='search-order'),
    path('<int:order_id>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('<int:order_id>/payment/', views.process_payment, name='process-payment'),
    path('<int:order_id>/status/', views.update_order_status, name='update-order-status'),
]
