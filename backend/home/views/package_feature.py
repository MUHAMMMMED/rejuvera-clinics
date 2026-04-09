from rest_framework.viewsets import ModelViewSet
from ..models import PackageFeature
from ..serializers import PackageFeatureWriteSerializer
from rest_framework.permissions import IsAuthenticated


class PackageFeatureViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated] 
    queryset = PackageFeature.objects.all()
    serializer_class = PackageFeatureWriteSerializer
 