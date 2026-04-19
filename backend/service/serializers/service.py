from rest_framework import serializers
from ..models import Service
from .service_hero import  ServiceHeroReadSerializer
from .service_faq import   ServiceFAQReadSerializer
from .service_doctor import  ServiceDoctorReadSerializer
from .service_trust import ServiceTrustReadSerializer
from .service_problem_solution import ServiceProblemSolutionReadSerializer
from .before_after import BeforeAfterImageReadSerializer
from .review import ReviewReadSerializer
from .Feature import  FeatureReadSerializer
from .process_step import ProcessStepsReadSerializer 
from home.models import SiteInfo
from home.serializers import SiteInfoReadSerializer


class ServiceDetailsSerializer(serializers.ModelSerializer):

    hero = ServiceHeroReadSerializer(read_only=True)
    problem_solution = ServiceProblemSolutionReadSerializer(read_only=True)
    feature=FeatureReadSerializer(read_only=True)
    process_steps=ProcessStepsReadSerializer(read_only=True)
    before_after=BeforeAfterImageReadSerializer(many=True, read_only=True)
    trust = ServiceTrustReadSerializer(read_only=True) 
    reviews=ReviewReadSerializer(many=True, read_only=True)
    service_doctors = ServiceDoctorReadSerializer(many=True, read_only=True)
    faqs = ServiceFAQReadSerializer(many=True, read_only=True)
    site_info = serializers.SerializerMethodField()
    def get_site_info(self, obj):
        # جلب أول سجل من SiteInfo
        site_info_instance = SiteInfo.objects.first()  # أول واحد
        if site_info_instance:
            return SiteInfoReadSerializer(site_info_instance).data
        return None
 

    class Meta:
        model = Service
        fields = '__all__'

class ServicesToCategorySerializer(serializers.ModelSerializer):

    hero = ServiceHeroReadSerializer(read_only=True)
    feature = FeatureReadSerializer(read_only=True)
    process_steps = ProcessStepsReadSerializer(read_only=True)
    before_after = BeforeAfterImageReadSerializer(many=True, read_only=True)
    trust = ServiceTrustReadSerializer(read_only=True) 

    class Meta:
        model = Service
        fields = '__all__'

class ServiceWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'
        read_only_fields = ['slug', 'id']


class ServiceReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class ServiceListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'


