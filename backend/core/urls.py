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

# إضافة هذا الجزء لتشغيل ملفات الميديا أثناء التطوير
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)