from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Device
from .serializers import DeviceWriteSerializer,DeviceReadSerializer,DeviceListSerializer
from service.models import Service
from service.serializers import ServiceWriteSerializer
import json
from rest_framework.permissions import IsAuthenticated
from django.core.cache import cache
 

class DeviceListAPIView(APIView):

    def get(self, request):
        cache_key = "device_list_all"
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data, status=status.HTTP_200_OK)

        devices = Device.objects.all()
        serializer = DeviceListSerializer(
            devices,
            many=True,
            context={'request': request}
        )

        cache.set(cache_key, serializer.data, timeout=300)  # 5 minutes

        return Response(serializer.data, status=status.HTTP_200_OK)

 

class DeviceDetailAPIView(APIView):

    def get(self, request, id):
        cache_key = f"device_detail_{id}"
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data, status=status.HTTP_200_OK)

        device = get_object_or_404(Device, id=id)
        serializer = DeviceReadSerializer(
            device,
            context={'request': request}
        )

        cache.set(cache_key, serializer.data, timeout=300)  # 5 minutes

        return Response(serializer.data, status=status.HTTP_200_OK)
 



class DashboardDeviceAPIView(APIView):
    permission_classes = [IsAuthenticated] 
    def get(self, request, id):
        device = get_object_or_404(Device, id=id)
        device_serializer = DeviceReadSerializer(device,context={'request': request})

        services = Service.objects.all()
        services_serializer = ServiceWriteSerializer(services, many=True,)

        return Response({
            "device": device_serializer.data,
            "services": services_serializer.data
        }, status=status.HTTP_200_OK)
 






# ─────────────────────────────────────────────
# Helper
# ─────────────────────────────────────────────

def _parse_related_services(data):
    """
    يحوّل related_services من JSON string إلى list of ints.
    FormData لا تدعم nested arrays مباشرةً، لذلك الـ Frontend
    يُرسلها كـ JSON.stringify([1, 2, 3]).
    """
    mutable = data.copy()
    raw = mutable.get('related_services')
    if isinstance(raw, str):
        try:
            parsed = json.loads(raw)
            mutable.setlist('related_services', [str(pk) for pk in parsed])
        except (json.JSONDecodeError, TypeError, ValueError):
            pass
    return mutable


class DeviceViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated] 
    queryset = Device.objects.prefetch_related('related_services').all()
    serializer_class = DeviceWriteSerializer

    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return DeviceReadSerializer
        return DeviceWriteSerializer

    # ── retrieve ──────────────────────────────
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        device_data = DeviceReadSerializer(
            instance, context={'request': request}
        ).data

        all_services = ServiceWriteSerializer(
            Service.objects.all(), many=True
        ).data

        return Response({
            'device': device_data,
            'services': all_services
        })

    # ── list ──────────────────────────────────
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = DeviceReadSerializer(
            queryset, many=True, context={'request': request}
        )
        return Response(serializer.data)

    # ── create ────────────────────────────────
    def create(self, request, *args, **kwargs):
        data = _parse_related_services(request.data)
        serializer = self.get_serializer(data=data)

        if serializer.is_valid():
            device = serializer.save() 
            response_data = DeviceReadSerializer(
                device, context={'request': request}
            ).data
            
            return Response(response_data, status=status.HTTP_201_CREATED)

        print("Create serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        data = _parse_related_services(request.data)
        partial = kwargs.pop('partial', True)
        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=data,
            partial=partial
        )

        if serializer.is_valid():
            device = serializer.save()  
            response_data = DeviceReadSerializer(
                device, context={'request': request}
            ).data
            
            return Response(response_data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)