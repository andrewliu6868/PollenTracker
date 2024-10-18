from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Medication(models.Model):
    name = models.CharField(max_length=100)
    usage_instructions = models.TextField()
    dosage = models.IntegerField()
    
    def __str__(self):
        return self.name
    
# default Django User already provides first and last names
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    emergency_contact_name = models.CharField(max_length=100)
    emergency_contact_phone = models.CharField(max_length=15)
    
    def __str__(self):
        return f"{self.user.username}'s profile"
    
# to track Allergy Events
class AllergyEvent(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    symptom_description = models.TextField()
    severity = models.IntegerField(choices=[(1, 'Mild'), (2, 'Moderate'), (3, 'Severe')])
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Allergy event for {self.user.username} - Severity: {self.get_severity_display()}"
    
    