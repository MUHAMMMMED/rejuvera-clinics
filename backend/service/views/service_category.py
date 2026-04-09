from rest_framework.viewsets import ModelViewSet
from ..models import ServiceCategory
from ..serializers import ServiceCategoryWriteSerializer
from rest_framework.permissions import IsAuthenticated
 
class ServiceCategoryViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated] 
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategoryWriteSerializer


