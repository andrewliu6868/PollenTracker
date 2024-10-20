from django.shortcuts import render
from django.http import HttpResponse
from .serializers import UserProfileSerializer, AllergenSpeciesSerializer, SymptomTrackingSerializer, PollenDataSerializer, MedicationSerializer

def home(request):
    return HttpResponse("Welcome to the Allergy Tracker!")

# Create your views here.
