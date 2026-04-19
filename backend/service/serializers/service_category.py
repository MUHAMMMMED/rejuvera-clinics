from rest_framework import serializers
from ..models import ServiceCategory 
from .service import  ServiceReadSerializer ,ServicesToCategorySerializer 
from home.models import SiteInfo
from home.serializers import SiteInfoReadSerializer

class ServiceCategoryWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory 
        fields = '__all__'

 
class ServiceCategoryReadSerializer(serializers.ModelSerializer):
    services = ServiceReadSerializer(many=True, read_only=True)

    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'description', 'services']



class CategoryDetailsReadSerializer(serializers.ModelSerializer):
    services = ServicesToCategorySerializer(many=True, read_only=True)
    site_info = serializers.SerializerMethodField()
    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'description', 'services','site_info']
   
    def get_site_info(self, obj):
        # جلب أول سجل من SiteInfo
        site_info_instance = SiteInfo.objects.first()  # أول واحد
        if site_info_instance:
            return SiteInfoReadSerializer(site_info_instance).data
        return None
 