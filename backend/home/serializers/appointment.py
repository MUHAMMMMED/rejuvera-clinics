from rest_framework import serializers
from ..models import Appointment


class AppointmentWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'

 
class AppointmentReadSerializer(serializers.ModelSerializer):
    service_name = serializers.SerializerMethodField()
    package_name = serializers.SerializerMethodField()
    campaign_name = serializers.CharField(source='campaign.name', read_only=True)
    source_name = serializers.CharField(source='source.name', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id',
            'name',
            'phone',
            'item_type',
            'service_name',
            'package_name',
            'campaign_name',
            'source_name',
            'created_at'
        ]

    def get_service_name(self, obj):
        if obj.item_type == 's' and obj.service:
            return obj.service.name
        return None

    def get_package_name(self, obj):
        if obj.item_type == 'p' and obj.package:
            return obj.package.name
        return None

 

