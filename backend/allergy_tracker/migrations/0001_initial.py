# Generated by Django 5.1.2 on 2024-10-19 07:53

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='PollenData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('location', models.CharField(max_length=255)),
                ('pollen_type', models.CharField(max_length=100)),
                ('severity', models.FloatField()),
                ('date', models.DateField()),
                ('forecast_data', models.JSONField()),
            ],
        ),
        migrations.CreateModel(
            name='Medication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('med_name', models.CharField(max_length=200)),
                ('dosage', models.CharField(max_length=100)),
                ('instructions', models.TextField()),
                ('reminder_time', models.TimeField()),
                ('last_taken', models.DateTimeField(blank=True, null=True)),
                ('refill_reminder', models.BooleanField(default=False)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='AllergenSpecies',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('top_allergen', models.CharField(max_length=100)),
                ('severity', models.FloatField()),
                ('correlation_score', models.FloatField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('pollen_data', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='allergy_tracker.pollendata')),
            ],
        ),
        migrations.CreateModel(
            name='SymptomTracking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('symptom_type', models.CharField(max_length=100)),
                ('severity', models.IntegerField()),
                ('notes', models.TextField(blank=True, null=True)),
                ('date', models.DateField()),
                ('pollen_data', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='allergy_tracker.pollendata')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('location', models.CharField(max_length=255)),
                ('pollen_sensitivity', models.TextField()),
                ('medication_reminders_enabled', models.BooleanField(default=True)),
                ('symptom_tracking_enabled', models.BooleanField(default=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
