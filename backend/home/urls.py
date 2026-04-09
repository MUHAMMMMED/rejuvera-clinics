from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()

router.register(r'faq', FAQViewSet, basename='faq')
router.register(r'gallery', GalleryImageViewSet, basename='gallery-image')
router.register(r'package-features', PackageFeatureViewSet, basename='package-feature')
router.register(r'package', PackageViewSet, basename='package')
router.register(r'site-info', SiteInfoViewSet, basename='site-info')
router.register(r'source', SourceViewSet, basename='source')
router.register(r'campaign', CampaignViewSet, basename='campaign')

urlpatterns = [
    path('', HomeAPIView.as_view(), name='home'),
    path('dashboard/',DashboardAPIView.as_view(), name='dashboard'),
    path('appointments/new/', NewAppointmentView.as_view(), name='new_appointment'),
 
]
urlpatterns += router.urls