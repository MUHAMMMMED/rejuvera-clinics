from rest_framework.viewsets import ModelViewSet
from ..models import ServiceFAQ
from ..serializers import ServiceFAQWriteSerializer
from rest_framework.permissions import IsAuthenticated
  

class ServiceFAQViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated] 
    queryset = ServiceFAQ.objects.all()
    serializer_class = ServiceFAQWriteSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        service_id = self.request.query_params.get('service')
        if service_id:
            queryset = queryset.filter(service_id=service_id)
        return queryset