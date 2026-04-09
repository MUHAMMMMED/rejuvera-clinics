from rest_framework import serializers
from ..models import Campaign,Source 


class CampaignWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = '__all__'


class CampaignReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = '__all__'


class SourceWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Source
        fields = '__all__'

 



class SourceReadSerializer(serializers.ModelSerializer):
    campaign=CampaignReadSerializer(many=True, read_only=True)  # Nested serializer for campaigns
    class Meta:
        model = Source
        fields = '__all__'



 