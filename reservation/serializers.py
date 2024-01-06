from rest_framework.serializers import ModelSerializer
from . import models

class ReservationSerializer(ModelSerializer):
    class Meta:
        model = models.Reservation
        fields = "__all__"

class OrderItemSerializer(ModelSerializer):
    class Meta:
        model = models.OrderItem
        fields = "__all__"