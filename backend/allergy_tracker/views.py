from django.shortcuts import render
from django.http import HttpResponse
from .serializers import UserSerializer, UserProfileSerializer, AllergenSpeciesSerializer, SymptomTrackingSerializer, PollenDataSerializer, MedicationSerializer
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status



# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
