# Generated by Django 5.0.1 on 2024-01-05 16:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reservation', '0009_reservation_time_alter_reservation_date'),
    ]

    operations = [
        migrations.RenameField(
            model_name='reservation',
            old_name='time',
            new_name='end_time',
        ),
        migrations.AddField(
            model_name='reservation',
            name='start_time',
            field=models.TimeField(null=True),
        ),
    ]
