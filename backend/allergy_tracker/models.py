from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.
    
# default Django User already provides first and last names
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=255)
    pollen_sensitivity = models.TextField()  # store sensitivity for different allergens (e.g., pollen, food)
    medication_reminders_enabled = models.BooleanField(default=True)
    symptom_tracking_enabled = models.BooleanField(default=True)
    # add notification preferences later if needed

    def __str__(self):
        return self.user.username
    
class PollenData(models.Model):
    location = models.CharField(max_length=255)  # location of the user
    pollen_type = models.CharField(max_length=100)  # E.g., Ragweed, Birch, Grass
    severity = models.FloatField()  # Pollen severity level (e.g., 0-10)
    date = models.DateField()
    forecast_data = models.JSONField()  # store forecast details for multiple days

    def __str__(self):
        return f"{self.pollen_type} - {self.location} ({self.date})"
    
class Medication(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    med_name = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100)
    instructions = models.TextField() # notes on when to take it (with food?)
    reminder_time = models.TimeField()
    last_taken = models.DateTimeField(null = True, blank = True)
    refill_reminder = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.med_name} for {self.user.username}"

def default_top_allergens():
    return [{"count": 1, "name": "Others"}]
class SymptomTracking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Link entry to a user
    symptoms = models.JSONField()  # Store symptoms checklist as a JSON object
    topAllergens = models.JSONField(default=default_top_allergens) # Store top allergens as a JSON object
    severity = models.IntegerField()  # Store severity level from the slider
    notes = models.TextField(blank=True, null=True)  # Additional notes
    date_created = models.DateTimeField(auto_now_add=True)  # Date of entry

    def __str__(self):
        return f"Journal Entry for {self.user.username} on {self.date_created}"
    
# for the feature that identifies the allergens most likely to affect the user based ontehir symptom logs and pollen data
class AllergenSpecies(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    pollen_data = models.ForeignKey(PollenData, on_delete=models.CASCADE)
    top_allergen = models.CharField(max_length=100) # store the most likely allergen (Birch, Ragweed...etc)
    severity = models.FloatField()
    correlation_score = models.FloatField()
    
    def __str__(self):
        return f"Top allergen for {self.user.username}: {self.top_allergen}"

    