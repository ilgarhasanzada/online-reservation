from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name = 'home'),
    path('reservations/', views.reservations, name = 'reservations'),
    path('get_menu_items/<int:category_id>/', views.get_menu_items, name='get_menu_items'),
    path('all_menu_items/', views.all_menu_items, name='all_menu_items'),
    path('tables/<int:restaurant_id>/<str:date>/<str:start_time_format>/<str:end_time_format>/', views.get_available_tables, name='get_tables'),
    
    path('api/reservations/', views.ReservationCreateAPIView.as_view()),
    path('api/order-items/', views.OrderItemCreateAPIView.as_view()),

    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('register/', views.register, name='register'),

]
