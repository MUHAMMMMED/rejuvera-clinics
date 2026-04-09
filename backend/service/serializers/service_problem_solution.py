from rest_framework import serializers
from ..models import ServiceProblemSolution


class ServiceProblemSolutionWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceProblemSolution
        fields = '__all__'


class ServiceProblemSolutionReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceProblemSolution
        fields = '__all__'


 

