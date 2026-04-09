from rest_framework import serializers
from ..models import ServiceFAQ

class ServiceFAQWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceFAQ
        fields = '__all__'


class ServiceFAQReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceFAQ
        fields = '__all__'


