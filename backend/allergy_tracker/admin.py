from django.contrib import admin
from .models import UserProfile, PollenData, Medication, SymptomTracking, AllergenSpecies

admin.site.register(UserProfile)
admin.site.register(PollenData)
admin.site.register(Medication)
admin.site.register(SymptomTracking)
admin.site.register(AllergenSpecies)
