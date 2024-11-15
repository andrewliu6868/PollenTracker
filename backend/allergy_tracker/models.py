from django.db import models
from django.contrib.auth.models import User

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

    
class Medication(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    med_name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    dosage = models.CharField(max_length=100)
    frequency = models.IntegerField(default=1)
    reminder_times = models.JSONField(default=list)
    repeat_count = models.IntegerField(default=1)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    refill_reminder = models.BooleanField(default=False)
    refill_date = models.DateField(blank=True, null=True)
    instructions = models.TextField(blank=True, null=True)
    last_taken = models.DateTimeField(null=True, blank=True)

    
    def __str__(self):
        return f"{self.med_name} for {self.user.username}"

class SymptomTracking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    pollen_data = models.ForeignKey(PollenData, on_delete=models.CASCADE)
    symptom_type = models.CharField(max_length=100) # basic description like sneezing, irritation
    severity = models.IntegerField() # rate on a number 1-10, or even 1-20
    notes = models.TextField(blank=True, null=True) # can be null
    date = models.DateField()
    
    def __str__(self):
        return f"{self.user.username} - {self.symptom_type} ({self.date})"
    
# for the feature that identifies the allergens most likely to affect the user based ontehir symptom logs and pollen data
class AllergenSpecies(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    pollen_data = models.ForeignKey(PollenData, on_delete=models.CASCADE)
    top_allergen = models.CharField(max_length=100) # store the most likely allergen (Birch, Ragweed...etc)
    severity = models.FloatField()
    correlation_score = models.FloatField()
    
    def __str__(self):
        return f"Top allergen for {self.user.username}: {self.top_allergen}"

    