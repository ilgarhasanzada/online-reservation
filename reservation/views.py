from .models import Restaurant
from django.http import JsonResponse
from .models import Restaurant, Table, Reservation, Category, MenuItem
import datetime
from django.db.models import Q
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from .forms import SignUpForm, LoginForm
from django.contrib.auth.decorators import login_required
from rest_framework.generics import CreateAPIView
from . import serializers
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

@login_required
def index(request):
    context ={
        "restaurants": Restaurant.objects.all(),
        "categories": Category.objects.all(),
        "menu_items": MenuItem.objects.all()
    }
    return render(request, 'index.html', context = context)

def is_valid_reservation_time(restaurant_id, start_time, end_time):
    restaurant = Restaurant.objects.get(id=restaurant_id)
    restaurant_opening_time = datetime.datetime.strptime(str(restaurant.opening_time), '%H:%M:%S').time()
    restaurant_closing_time = datetime.datetime.strptime(str(restaurant.closing_time), '%H:%M:%S').time()
    return (
        restaurant_opening_time <= start_time.time() <= restaurant_closing_time and
        restaurant_opening_time <= end_time.time() <= restaurant_closing_time
    )

def get_available_tables(request, restaurant_id, date, start_time_format, end_time_format):
    if request.method == 'GET':
        start_time = datetime.datetime.strptime(f'{date} {start_time_format}', '%Y-%m-%d %H:%M')
        end_time = datetime.datetime.strptime(f'{date} {end_time_format}', '%Y-%m-%d %H:%M')
                    

        if not is_valid_reservation_time(restaurant_id, start_time, end_time):
                return JsonResponse({'error': 'Reservation time is not valid for this restaurant'}, status=400)
            
        reserved_tables = Reservation.objects.filter(
            Q(start_time__lte=start_time, end_time__gte=start_time) | 
            Q(start_time__lte=end_time, end_time__gte=end_time) | 
            Q(start_time__gte=start_time, end_time__lte=end_time),
            table__restaurant_id=restaurant_id,
            date=date,
        ).values_list('table_id', flat=True)
        
        available_tables = Table.objects.filter(restaurant_id=restaurant_id).exclude(id__in=reserved_tables)
        
        data = {'available_tables': [
            {'id': table.pk, 'table_number': table.table_number,'capacity': table.capacity ,'image': table.image.url} 
            for table in available_tables
        ]}
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
def get_menu_items(request, category_id):
    category = Category.objects.get(pk=category_id)
    menu_items = MenuItem.objects.filter(category=category)
    data = [{'id':item.pk,'name': item.name, 'image': item.image.url, 'price': item.price} for item in menu_items]
    return JsonResponse(data, safe=False)

def all_menu_items(request):
    menu_items = MenuItem.objects.all()
    data = [{'id':item.pk,'name': item.name, 'image': item.image.url, 'price': item.price} for item in menu_items]
    return JsonResponse(data, safe=False)

class ReservationCreateAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = serializers.ReservationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrderItemCreateAPIView(CreateAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = serializers.OrderItemSerializer

@login_required
def reservations(request):
    context ={
        "reservations": Reservation.objects.filter(user = request.user)
    }
    return render(request, 'reservations.html', context = context)

def register(request):
    if request.user.is_authenticated:
        return redirect("home")
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            new_user = authenticate(username=form.cleaned_data['username'],
                                    password=form.cleaned_data['password1'],
                                    )
            login(request, new_user)
            return redirect('home')
    else:
        form = SignUpForm()
    return render(request, 'register.html', {'form': form})

def user_login(request):
    if request.user.is_authenticated:
        return redirect("home")
    if request.method == 'POST':
        form = LoginForm(data=request.POST)
        if form.is_valid():
            user = authenticate(request, username=form.cleaned_data['username'], password=form.cleaned_data['password'])
            if user is not None:
                login(request, user)
                return redirect('home') 
    form = LoginForm()
    return render(request, 'login.html', {'form': form})

def user_logout(request):
    logout(request)
    return redirect('home') 
