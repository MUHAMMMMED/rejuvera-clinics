 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from ..models import Service
from service.serializers import ServiceDetailsSerializer,ServiceWriteSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
    
 

class ServicesByCategoryView(APIView):
    def get(self, request, category_id):
        services = Service.objects.filter(category_id=category_id)
        serializer = ServiceWriteSerializer(services, many=True)
        return Response(serializer.data)

 
class ServicesListView(APIView):
    def get(self, request):
        services = Service.objects.all()
        serializer = ServiceWriteSerializer(services, many=True)
        return Response(serializer.data)

 

class ServiceDetailsAPIView(APIView):
    def get(self, request, id):
        service = get_object_or_404(Service, id=id)
        serializer = ServiceDetailsSerializer(
            service,
            context={'request': request}  )
        return Response(serializer.data)



class DashboardServiceAPIView(APIView):
    permission_classes = [IsAuthenticated] 
    def get(self, request, id):
        service = get_object_or_404(Service, id=id)
        serializer = ServiceDetailsSerializer(
            service,
            context={'request': request}  )
        return Response(serializer.data)
 


 
class ServiceViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated] 
    queryset = Service.objects.all()
    serializer_class = ServiceWriteSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        # طباعة كل عنصر في الـ queryset
        print("=== Queryset Items ===")
        for item in queryset:
            print(item)
        
        serializer = self.get_serializer(queryset, many=True)
        # طباعة البيانات بعد السيريلزر
        print("=== Serialized Data ===")
        print(serializer.data)
        
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        print("=== Retrieved Object ===")
        print(instance)
        
        serializer = self.get_serializer(instance)
        print("=== Serialized Data ===")
        print(serializer.data)
        
        return Response(serializer.data)