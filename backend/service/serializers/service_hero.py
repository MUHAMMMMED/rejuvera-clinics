from rest_framework import serializers
from ..models import ServiceHero

class ServiceHeroWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceHero
        fields = '__all__'


class ServiceHeroReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceHero
        fields = '__all__'


