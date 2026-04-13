from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

urlpatterns = [
    path("api/admin/", admin.site.urls),
    path("api/users/", include("users.urls")),
    path("api/home/", include("home.urls")),
    path("api/services/", include("service.urls")),
    path("api/blog/", include("blog.urls")),
    path("api/device/", include("device.urls")),
]

# ✅ FIX: serve media in both DEBUG and production via Django (fallback only)
# nginx is handling this in production, but keep as fallback
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)