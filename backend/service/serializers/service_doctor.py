from rest_framework import serializers
from ..models import ServiceDoctor
from .doctor import DoctorReadSerializer



class ServiceDoctorWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = ServiceDoctor
        fields = '__all__'


class ServiceDoctorReadSerializer(serializers.ModelSerializer):
    doctor = DoctorReadSerializer(read_only=True)
    class Meta:
        model = ServiceDoctor
        fields = '__all__'


