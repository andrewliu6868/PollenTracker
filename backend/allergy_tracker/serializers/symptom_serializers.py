from rest_framework import serializers
from ..models import SymptomTracking

class SymptomTrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SymptomTracking
        fields = '__all__'