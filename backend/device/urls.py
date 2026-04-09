from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'devices', DeviceViewSet, basename='devices')

 
urlpatterns = [
    path('list/', DeviceListAPIView.as_view(), name='device-list'),
    path('device/<int:id>/', DeviceDetailAPIView.as_view(), name='device-detail'),
    path('dashboard/device/<int:id>/', DashboardDeviceAPIView.as_view(), name='device-detail'),
 
    path('', include(router.urls)),
]