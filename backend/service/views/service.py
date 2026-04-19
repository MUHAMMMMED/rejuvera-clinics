 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from ..models import Service
from service.serializers import ServiceDetailsSerializer,ServiceWriteSerializer,CategoryDetailsReadSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache
from rest_framework import status
 
 
class ServicesByCategoryView(APIView):

    def get(self, request, category_id):
        cache_key = f"services_by_category_{category_id}"
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data, status=status.HTTP_200_OK)

        services = Service.objects.filter(category_id=category_id)
        serializer = ServiceWriteSerializer(services, many=True)

        cache.set(cache_key, serializer.data, timeout=300)  # 5 minutes

        return Response(serializer.data, status=status.HTTP_200_OK)





class ServicesListView(APIView):

    def get(self, request):
        cache_key = "services_list_all"
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data, status=status.HTTP_200_OK)

        services = Service.objects.all()
        serializer = ServiceWriteSerializer(services, many=True)

        cache.set(cache_key, serializer.data, timeout=300)  # 5 minutes

        return Response(serializer.data, status=status.HTTP_200_OK)
 


 

class ServiceDetailsAPIView(APIView):

    def get(self, request, id):
        cache_key = f"service_detail_{id}"
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data, status=status.HTTP_200_OK)

        service = get_object_or_404(Service, id=id)
        serializer = ServiceDetailsSerializer(
            service,
            context={'request': request}
        )

        cache.set(cache_key, serializer.data, timeout=300)  # 5 minutes

        return Response(serializer.data, status=status.HTTP_200_OK)






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

        for item in queryset:
            print(item)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)        
        return Response(serializer.data)