from rest_framework.viewsets import ModelViewSet
from ..models import ServiceTrust
from ..serializers import ServiceTrustWriteSerializer
from rest_framework.permissions import IsAuthenticated
 


class ServiceTrustViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated] 
    queryset = ServiceTrust.objects.all()
    serializer_class = ServiceTrustWriteSerializer