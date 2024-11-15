from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import Medication, DeviceToken
from .serializers import UserSerializer, DeviceTokenSerializer, MedicationSerializer
from django.contrib.auth.models import User
from .utils import schedule_reminder_notifications, schedule_refill_notification, cancel_notifications
from django.utils import timezone
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
    try:
        # Log the incoming data
        print("Received data:", request.data)
        serializer = MedicationSerializer(data=request.data, context={'request': request})
        
        # Check if the data is valid
        if not serializer.is_valid():
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        medication = serializer.save()
        return Response(MedicationSerializer(medication).data, status=status.HTTP_201_CREATED)
    except Exception as e:
        print("Error in add_medication:", str(e))
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_medication(request, pk):
    medication = get_object_or_404(Medication, pk=pk, user=request.user)
    serializer = MedicationSerializer(medication, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)      

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_medication(request, pk):
    medication = get_object_or_404(Medication, pk=pk, user=request.user)
    
    # Cancel scheduled notifications
    cancel_notifications(medication.reminder_notification_ids)
    if medication.refill_notification_id:
        cancel_push_notification(medication.refill_notification_id)
    
    medication.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_device_token(request):
    token = request.data.get('token')
    if not token:
        return Response({"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST)

    DeviceToken.objects.update_or_create(
        user=request.user,
        defaults={"token": token}
    )
    return Response({"message": "Device token registered successfully"}, status=status.HTTP_200_OK)
