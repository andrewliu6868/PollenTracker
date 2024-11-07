from rest_framework import serializers
from .models import AllergenSpecies, Medication, UserProfile, SymptomTracking, PollenData
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.models import User
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
        fields = '__all__'
        

class SymptomTrackingSerializer(serializers.ModelSerializer):
    date_created = serializers.SerializerMethodField()
    class Meta:
        model = SymptomTracking
        fields = ['id', 'user', 'symptoms', 'severity', 'notes', 'date_created']
        read_only_fields = ['user', 'date_created']

    def get_date_created(self, obj):
        # Convert to local time and format
        return localtime(obj.date_created).strftime('%b %d, %Y, %I:%M %p')
        
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'