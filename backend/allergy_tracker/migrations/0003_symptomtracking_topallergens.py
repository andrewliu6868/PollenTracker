# Generated by Django 4.2.16 on 2024-11-10 23:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('allergy_tracker', '0002_remove_symptomtracking_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='symptomtracking',
            name='topAllergens',
            field=models.JSONField(default=[{'count': 1, 'name': 'Others'}]),
        ),
    ]
