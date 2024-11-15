from rest_framework import serializers
from .models import AllergenSpecies, Medication, UserProfile, SymptomTracking, PollenData, DeviceToken
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.models import User
from .utils import schedule_push_notification, schedule_reminder_notifications, schedule_refill_notification, cancel_notifications

class DeviceTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceToken
        fields = '__all__'

    
from django.utils.timezone import localtime

class AllergenSpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = AllergenSpecies
        fields = '__all__'
        
class PollenDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollenData
        fields = '__all__'
        
class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = [
            'id', 'med_name', 'description', 'dosage', 'frequency',
            'reminder_times', 'reminder_notification_ids', 'refill_notification_id',
            'refill_reminder', 'refill_date', 'start_date', 'end_date'
        ]
        read_only_fields = ['user']

    def create(self, validated_data):
        # Associate medication with the current user
        validated_data['user'] = self.context['request'].user
        medication = super().create(validated_data)

        # Retrieve the token from request headers
        raw_token = self.context['request'].headers.get('Authorization')
        if not raw_token:
            raise ValueError("Missing Authorization token")

        # Extract the actual token by removing the 'Bearer' prefix if present
        token = raw_token.replace('Bearer ', '') if 'Bearer' in raw_token else raw_token

        # Verify token is not empty after processing
        if not token:
            raise ValueError("Invalid Authorization token")

        # Schedule notifications
        try:
            medication.reminder_notification_ids = schedule_reminder_notifications(
                validated_data['reminder_times'],
                medication,
                validated_data['start_date'],
                validated_data['end_date'],
                token  # Ensure the token is passed here
            )

            if validated_data['refill_reminder'] and validated_data['refill_date']:
                medication.refill_notification_id = schedule_refill_notification(
                    validated_data['refill_date'],
                    medication,
                    token  # Ensure the token is passed here
                )

            medication.save()
        except Exception as e:
            # Handle any exceptions that occur during scheduling
            print(f"Error scheduling notifications: {e}")
            raise serializers.ValidationError("Failed to schedule notifications")

        return medication


class SymptomTrackingSerializer(serializers.ModelSerializer):
    date_created = serializers.SerializerMethodField()
    class Meta:
        model = SymptomTracking
        fields = ['id', 'user', 'symptoms', 'topAllergens', 'severity', 'notes', 'date_created']
        read_only_fields = ['user', 'date_created']

    def get_date_created(self, obj):
        # Convert to local time and format
        return localtime(obj.date_created).strftime('%b %d, %Y, %I:%M %p')
        
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
        