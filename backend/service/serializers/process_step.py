from rest_framework import serializers
from ..models import ProcessSteps

class ProcessStepsWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessSteps
        fields = '__all__'


class ProcessStepsReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessSteps
        fields = '__all__'


