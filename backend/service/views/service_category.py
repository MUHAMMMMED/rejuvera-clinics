from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from ..models import ServiceCategory
from ..serializers import ServiceCategoryWriteSerializer,CategoryDetailsReadSerializer



class ServiceCategoryViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated] 
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategoryWriteSerializer


class CategoryDetailsView(APIView):

    def get(self, request, category_id):
        # cache_key = f"category_{category_id}"
        # cached_data = cache.get(cache_key)

        # if cached_data:
        #     return Response(cached_data, status=status.HTTP_200_OK)

        category= get_object_or_404(ServiceCategory, id=category_id)
        serializer = CategoryDetailsReadSerializer(category)

        # cache.set(cache_key, serializer.data, timeout=300)

        return Response(serializer.data, status=status.HTTP_200_OK)


