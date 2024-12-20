# Generated by Django 4.2.16 on 2024-11-15 10:44

import allergy_tracker.models
from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('allergy_tracker', '0003_remove_medication_end_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='medication',
            name='end_date',
            field=models.DateField(default=allergy_tracker.models.default_end_date),
        ),
        migrations.AddField(
            model_name='medication',
            name='start_date',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]
