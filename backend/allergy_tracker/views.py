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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
    
