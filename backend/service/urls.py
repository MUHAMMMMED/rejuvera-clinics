from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'service-categories', ServiceCategoryViewSet, basename='service-category')
router.register(r'service', ServiceViewSet, basename='service')
router.register(r'service-trust', ServiceTrustViewSet, basename='service-trust')


router.register(r'service-reviews', ReviewViewSet, basename='service-reviews')
 
router.register(r'feature', FeatureViewSet, basename='service-feature')
router.register(r'service-hero', ServiceHeroViewSet, basename='service-hero')
router.register(r'service-faqs', ServiceFAQViewSet, basename='service-faq')
router.register(r'service-doctors', ServiceDoctorViewSet, basename='service-doctor')
router.register(r'doctor', DoctorViewSet, basename='doctor')

router.register(r'service-steps', ProcessStepsViewSet, basename='service-steps')
router.register(r'service-problem-solutions', ServiceProblemSolutionViewSet, basename='service-problem-solution')
router.register(r'before-after-images', BeforeAfterImageViewSet, basename='before-after-image')


urlpatterns = [
    path('list/', ServicesListView.as_view(), name='services-list'),
    path('service/<int:id>/details/', ServiceDetailsAPIView.as_view(), name='service-details'),
     path('dashboard/service/<int:id>/details/', DashboardServiceAPIView.as_view(), name='service-details'),
 

    path('category/<int:category_id>/details/', CategoryDetailsView.as_view(), name='category-details'),
    path('category/<int:category_id>/services/', ServicesByCategoryView.as_view(), name='service-category-details'),
 
]

urlpatterns += router.urls