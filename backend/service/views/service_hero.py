from rest_framework.viewsets import ModelViewSet
from ..models import ServiceHero
from ..serializers import ServiceHeroWriteSerializer


from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from rest_framework.permissions import IsAuthenticated
 


class ServiceHeroViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated] 
    queryset = ServiceHero.objects.all()
    serializer_class = ServiceHeroWriteSerializer

    def create(self, request, *args, **kwargs):
        print("Create request data:", request.data)  # بيانات اللي جاية
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            print("Create serializer data saved:", serializer.data)  # بيانات بعد الحفظ
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Create serializer errors:", serializer.errors)  # لو فيه errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        print("Update request data:", request.data)
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            self.perform_update(serializer)
            print("Update serializer data saved:", serializer.data)
            return Response(serializer.data)
        else:
            print("Update serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)