from rest_framework import serializers
from .models import AllergenSpecies, Medication, UserProfile, SymptomTracking, PollenData
from django.contrib.auth.models import User

class AllergenSpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = AllergenSpecies
        fields = '__all__'
        
class PollenDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollenData
        fields = '__all__'
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}} # ensure it's write only
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = '__all__'
        

class SymptomTrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SymptomTracking
        fields = '__all__'
        
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'