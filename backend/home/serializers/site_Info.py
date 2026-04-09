from rest_framework import serializers
from ..models import SiteInfo


class SiteInfoWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteInfo
        fields = '__all__'


class SiteInfoReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteInfo
        fields = '__all__'


 

