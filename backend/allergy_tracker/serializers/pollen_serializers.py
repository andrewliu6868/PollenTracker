from rest_framework import serializers
from ..models import PollenData

class PollenDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollenData
        fields = '__all__'