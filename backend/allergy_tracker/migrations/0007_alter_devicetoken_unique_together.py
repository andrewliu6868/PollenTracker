# Generated by Django 4.2.16 on 2024-11-16 06:15

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('allergy_tracker', '0006_alter_devicetoken_token'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='devicetoken',
            unique_together={('user', 'token')},
        ),
    ]
