from rest_framework.viewsets import ModelViewSet
from ..models import BeforeAfterImage
from ..serializers import BeforeAfterImageWriteSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
 
class BeforeAfterImageViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated] 
    queryset = BeforeAfterImage.objects.all()
    serializer_class = BeforeAfterImageWriteSerializer

    # فلترة حسب الخدمة
    def get_queryset(self):
        queryset = super().get_queryset()
        service_id = self.request.query_params.get('service')
        if service_id:
            queryset = queryset.filter(service_id=service_id)
        return queryset

    def create(self, request, *args, **kwargs):
        print("Create request data:", request.data)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            print("Create saved data:", serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Create serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        print("Update request data:", request.data)
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            self.perform_update(serializer)
            print("Update saved data:", serializer.data)
            return Response(serializer.data)
        else:
            print("Update serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)