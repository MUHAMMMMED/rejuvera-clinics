from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from service.models import ServiceCategory,Doctor
from ..models import SiteInfo, FAQ, Package, GalleryImage,Package 
from service.serializers import (
    ServiceCategoryReadSerializer,
    DoctorReadSerializer,
    )
from home.serializers import (
    SiteInfoReadSerializer,
    FAQReadSerializer,
    PackageReadSerializer,
    GalleryImageReadSerializer,
 
    )





class HomeAPIView(APIView):

    def get(self, request):
        try:
            info_instance = SiteInfo.objects.first()
            categories = ServiceCategory.objects.all()
            faqs = FAQ.objects.all()
            packages = Package.objects.all()
            gallery = GalleryImage.objects.all()
            doctors = Doctor.objects.all()

            data = {
                "info": SiteInfoReadSerializer(info_instance, context={'request': request}).data if info_instance else None,
                "categories": ServiceCategoryReadSerializer(categories, many=True, context={'request': request}).data,
                "faqs": FAQReadSerializer(faqs, many=True, context={'request': request}).data,
                "packages": PackageReadSerializer(packages, many=True, context={'request': request}).data,
                "gallery": GalleryImageReadSerializer(gallery, many=True, context={'request': request}).data,
                "doctors": DoctorReadSerializer(doctors, many=True, context={'request': request}).data,
            }

            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



 
  
 

 