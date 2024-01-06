from django.contrib import admin
from django.contrib.admin import TabularInline

from . import models
admin.site.register(models.Reservation)
class TableAdmin(TabularInline):
    model = models.Table

@admin.register(models.Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
   inlines = [TableAdmin,]



admin.site.register(models.OrderItem)

admin.site.register(models.Category)
admin.site.register(models.MenuItem)
