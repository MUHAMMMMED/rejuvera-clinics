from rest_framework import serializers
from service.models import Service
from .models import Device
from service.serializers import ServiceWriteSerializer


class DeviceWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'

 

class DeviceWriteSerializer(serializers.ModelSerializer):
    """Serializer للكتابة – يقبل قائمة IDs للخدمات."""
    related_services = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        many=True,
        required=False,
    )

    class Meta:
        model = Device
        fields = [
            'id', 'name', 'summary', 'content',
            'image', 'technology', 'treatments', 'is_new',
            'related_services',
        ]

    def to_representation(self, instance):
        """بعد الحفظ، أرجع البيانات بصيغة القراءة الكاملة."""
        return DeviceReadSerializer(instance, context=self.context).data

 

class DeviceReadSerializer(serializers.ModelSerializer):
    related_services= ServiceWriteSerializer(many=True, read_only=True)
    class Meta:
        model = Device
        fields = '__all__'

 
class DeviceListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ['id','is_new', 'name','slug', 'image','summary', 'created_at']

