from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

# Create your models here.
    
# default Django User already provides first and last names
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=255)
    pollen_sensitivity = models.TextField()  # store sensitivity for different allergens (e.g., pollen, food)
    medication_reminders_enabled = models.BooleanField(default=True)
    symptom_tracking_enabled = models.BooleanField(default=True)

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

def default_end_date():
    return timezone.now().date() + timedelta(days=30)

class Medication(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    med_name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    dosage = models.CharField(max_length=100)
    frequency = models.IntegerField(default=1)
    reminder_times = models.JSONField(default=list)
    refill_reminder = models.BooleanField(default=False)
    refill_date = models.DateField(blank=True, null=True)
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(default=default_end_date)    
    reminder_notification_ids = models.JSONField(default=list, blank=True)
    refill_notification_id = models.CharField(max_length=255, null=True, blank=True)

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
    
class DeviceToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=200, unique=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.token}"
    

    