from rest_framework.viewsets import ModelViewSet
from ..models import ProcessSteps
from ..serializers import ProcessStepsWriteSerializer
from rest_framework.permissions import IsAuthenticated
       
class ProcessStepsViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated] 
    queryset = ProcessSteps.objects.all()
    serializer_class = ProcessStepsWriteSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        service_id = self.request.query_params.get('service')
        if service_id:
            queryset = queryset.filter(service_id=service_id)
        return queryset
    





 