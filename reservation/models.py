from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Restaurant(models.Model):
    name = models.CharField(max_length=100)
    city = models.CharField(max_length = 100, null = True )
    address = models.CharField(max_length = 200, null = True)
    image = models.ImageField(upload_to = 'restaurants')
    opening_time = models.TimeField(null = True)
    closing_time = models.TimeField(null = True)
    def __str__(self) -> str:
        return self.name
    
class Table(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name = 'tables')
    table_number = models.IntegerField()
    image = models.ImageField(upload_to = 'tables', null = True)
    capacity = models.IntegerField(default = 1)
    def __str__(self) -> str:
        return f'{self.restaurant.name} | {self.table_number}'

class Reservation(models.Model):
    table = models.ForeignKey(Table, on_delete=models.CASCADE, related_name = 'reservations')
    date = models.DateField(null = True)
    start_time = models.TimeField(null = True)
    end_time = models.TimeField(null = True)
    user = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'reservations')

    def __str__(self) -> str:
        return f'{self.table} | {self.date}'

class Category(models.Model):
    title = models.CharField(max_length = 50)
    image = models.ImageField(upload_to = 'catogry_images')
   
    def __str__(self) -> str:
        return self.title
    
class MenuItem(models.Model):
    name = models.CharField(max_length = 100)
    image = models.ImageField(upload_to = 'menu_items')
    price = models.DecimalField(max_digits = 5, decimal_places = 2)
    category = models.ForeignKey(Category, on_delete = models.CASCADE, related_name = 'menu_items')

    def __str__(self) -> str:
        return f'{self.name} | {self.category.title}'
    
    
class OrderItem(models.Model):
    menu_item = models.ForeignKey(MenuItem, on_delete = models.CASCADE, related_name = 'order_items', null = True)
    count = models.IntegerField(default = 1)
    user = models.ForeignKey(User, on_delete = models.CASCADE, related_name = 'order_items', null = True)
    reservation = models.ForeignKey(Reservation, on_delete = models.CASCADE, related_name = 'order_items', null = True, blank = True)
    
    def __str__(self) -> str:
        return f'{self.menu_item}'