 
from rest_framework.response import Response
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from ..models import SiteInfo
from ..serializers import SiteInfoWriteSerializer
from rest_framework.permissions import IsAuthenticated
  
class SiteInfoViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated] 
    queryset = SiteInfo.objects.all()
    serializer_class = SiteInfoWriteSerializer

    def create(self, request, *args, **kwargs):
        print("Create request data:", request.data)  # طباعة البيانات الواردة
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            print("Create success:", serializer.data)  # طباعة البيانات المحفوظة
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Create errors:", serializer.errors)  # طباعة الأخطاء
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        print("Update request data:", request.data)  # طباعة البيانات الواردة
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            self.perform_update(serializer)
            print("Update success:", serializer.data)  # طباعة البيانات المحدثة
            return Response(serializer.data)
        else:
            print("Update errors:", serializer.errors)  # طباعة الأخطاء
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)