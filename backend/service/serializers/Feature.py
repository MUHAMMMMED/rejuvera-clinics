 
from rest_framework import serializers
from ..models import Feature

class FeatureWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = '__all__'

class FeatureReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = '__all__'