from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'blogs', BlogViewSet, basename='blogs')

urlpatterns = [
 
    path('list/', BlogListAPIView.as_view(), name='blog-list'),
    path('blog/<int:id>/detail', BlogDetailAPIView.as_view(), name='blog-detail'),
    path('dashboard/blog/<int:id>/', DashboardBlogAPIView.as_view(), name='dashboard-blog-detail'),
    path('', include(router.urls)),
]