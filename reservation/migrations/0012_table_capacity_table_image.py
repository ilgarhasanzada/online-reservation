# Generated by Django 5.0.1 on 2024-01-05 19:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reservation', '0011_restaurant_closing_time_restaurant_opening_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='table',
            name='capacity',
            field=models.IntegerField(default=1),
        ),
        migrations.AddField(
            model_name='table',
            name='image',
            field=models.ImageField(null=True, upload_to='tables'),
        ),
    ]
