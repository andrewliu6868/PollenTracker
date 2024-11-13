from django.shortcuts import render
from django.http import HttpResponse
from .serializers import UserSerializer, UserProfileSerializer, AllergenSpeciesSerializer, SymptomTrackingSerializer, PollenDataSerializer, MedicationSerializer
from .models import SymptomTracking
from django.contrib.auth.models import User
from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from datetime import timedelta
from django.utils import timezone



# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CreateSymptomEntryView(generics.CreateAPIView):
    queryset = SymptomTracking.objects.all()
    serializer_class = SymptomTrackingSerializer
    permission_classes = [permissions.IsAuthenticated]  # Only allow logged-in users

    def perform_create(self, serializer):
        # Set the user to the logged-in user
        serializer.save(user=self.request.user)
class JournalEntryListView(generics.ListAPIView):
    serializer_class = SymptomTrackingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return entries for the logged-in user
        return SymptomTracking.objects.filter(user=self.request.user).order_by('-date_created')

class WeeklyJournalEntryListView(generics.ListAPIView):
    serializer_class = SymptomTrackingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Get the current date and time
        now = timezone.now()
        # Calculate the date and time for one week ago
        one_week_ago = now - timedelta(days=7)
        # Return entries for the logged-in user from the past week
        return SymptomTracking.objects.filter(user=self.request.user, date_created__gte=one_week_ago).order_by('-date_created')