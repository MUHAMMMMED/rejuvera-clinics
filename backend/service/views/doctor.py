from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from ..models import Doctor
from ..serializers import DoctorWriteSerializer
from rest_framework.permissions import IsAuthenticated
 
 
class DoctorViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated] 
    queryset = Doctor.objects.all()
    serializer_class = DoctorWriteSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        print("Create data received:", request.data)

        if serializer.is_valid():
            self.perform_create(serializer)
            print("Create serializer data:", serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print("Create serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # ✅ مهم جدًا
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=True  # يسمح بعدم إرسال كل الحقول
        )

        print("Update data received:", request.data)

        if serializer.is_valid():
            self.perform_update(serializer)
            print("Update serializer data:", serializer.data)
            return Response(serializer.data)

        print("Update serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)