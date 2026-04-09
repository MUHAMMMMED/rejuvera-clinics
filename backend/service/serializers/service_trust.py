from rest_framework import serializers
from ..models import ServiceTrust


class ServiceTrustWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceTrust
        fields = '__all__'


class ServiceTrustReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceTrust
        fields = '__all__'


 