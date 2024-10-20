from django.contrib import admin
from .models import UserProfile, PollenData, SymptomTracking, Medication

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(PollenData)
admin.site.register(SymptomTracking)
admin.site.register(Medication)

