# Generated by Django 5.0.1 on 2024-01-06 13:11

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reservation', '0017_orderitem_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderitem',
            name='reservation',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='order_items', to='reservation.reservation'),
        ),
    ]
