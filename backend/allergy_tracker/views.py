from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import Medication
from .serializers import UserSerializer, UserProfileSerializer, AllergenSpeciesSerializer, SymptomTrackingSerializer, PollenDataSerializer, MedicationSerializer
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes


# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_medications(request):
    medications = Medication.objects.filter(user=request.user)
    serializer = MedicationSerializer(medications, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_medication(request):
    serializer = MedicationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_medication(request):
    medication = get_object_or_404(Medication, pk=pk, user=request.user)
    serializer = MedicationSerializer(medication, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)      

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_medication(request):
    medication = get_object_or_404(Medication, pk=pk, user=request.user)
    medication.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
