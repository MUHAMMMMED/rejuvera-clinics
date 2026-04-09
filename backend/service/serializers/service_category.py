from rest_framework import serializers
from ..models import ServiceCategory 
from .service import  ServiceReadSerializer 

class ServiceCategoryWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory 
        fields = '__all__'

 
class ServiceCategoryReadSerializer(serializers.ModelSerializer):
    services = ServiceReadSerializer(many=True, read_only=True)

    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'description', 'services']