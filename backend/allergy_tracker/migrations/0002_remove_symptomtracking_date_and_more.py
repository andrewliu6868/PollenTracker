# Generated by Django 4.2.16 on 2024-11-05 00:31

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('allergy_tracker', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='symptomtracking',
            name='date',
        ),
        migrations.RemoveField(
            model_name='symptomtracking',
            name='pollen_data',
        ),
        migrations.RemoveField(
            model_name='symptomtracking',
            name='symptom_type',
        ),
        migrations.AddField(
            model_name='symptomtracking',
            name='date_created',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='symptomtracking',
            name='symptoms',
            field=models.JSONField(default=None),
            preserve_default=False,
        ),
    ]
