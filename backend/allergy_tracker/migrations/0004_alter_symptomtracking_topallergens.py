# Generated by Django 4.2.16 on 2024-11-10 23:20

import allergy_tracker.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('allergy_tracker', '0003_symptomtracking_topallergens'),
    ]

    operations = [
        migrations.AlterField(
            model_name='symptomtracking',
            name='topAllergens',
            field=models.JSONField(default=allergy_tracker.models.default_top_allergens),
        ),
    ]