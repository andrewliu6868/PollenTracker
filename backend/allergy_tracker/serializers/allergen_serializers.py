from rest_framework import serializers
from ..models import AllergenSpecies

class AllergenSpeciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = AllergenSpecies
        fields = '__all__'