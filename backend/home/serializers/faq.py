from rest_framework import serializers
from ..models import FAQ


class FAQWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'


class FAQReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'


 

