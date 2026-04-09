from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from .models import Blog
from service.models import Service
from .serializers import BlogWriteSerializer,BlogReadSerializer,BlogListSerializer
from service.serializers import ServiceWriteSerializer
from rest_framework.permissions import IsAuthenticated
 

class BlogListAPIView(APIView):
    def get(self, request):
        blogs = Blog.objects.all()
        serializer = BlogListSerializer(blogs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)




class BlogDetailAPIView(APIView):
    def get(self, request, id):
        blog = get_object_or_404(Blog, id=id)
        serializer = BlogReadSerializer(blog)
        return Response(serializer.data, status=status.HTTP_200_OK)



 
class DashboardBlogAPIView(APIView):
    permission_classes = [IsAuthenticated] 
    def get(self, request, id):
        blog = get_object_or_404(Blog, id=id)
        blog_serializer = BlogReadSerializer(blog)

        services = Service.objects.all()
        services_serializer = ServiceWriteSerializer(services, many=True)

        return Response({
            "blog": blog_serializer.data,
            "services": services_serializer.data
        }, status=status.HTTP_200_OK)

class BlogDetailAPIView(APIView):
    def get(self, request, id):
        blog = get_object_or_404(Blog, id=id)
        serializer = BlogReadSerializer(blog)
        return Response(serializer.data, status=status.HTTP_200_OK)

 

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
        import json
        try:
            parsed = json.loads(raw)
            mutable.setlist('related_services', [str(pk) for pk in parsed])
        except (json.JSONDecodeError, TypeError, ValueError):
            pass
    return mutable


class BlogViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated] 
    queryset = Blog.objects.prefetch_related('related_services').all()
    serializer_class = BlogWriteSerializer

    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return BlogReadSerializer
        return BlogWriteSerializer

    # ── retrieve ──────────────────────────────
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        blog_data = BlogReadSerializer(instance, context={'request': request}).data
        all_services = ServiceInlineSerializer(
            Service.objects.all(), many=True
        ).data
        return Response({'blog': blog_data, 'services': all_services})

    # ── list ──────────────────────────────────
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = BlogReadSerializer(
            queryset, many=True, context={'request': request}
        )
        return Response(serializer.data)

    # ── create ────────────────────────────────
    def create(self, request, *args, **kwargs):
        print("\n===== CREATE BLOG =====")
        print("Request data:", request.data)
        
        data = _parse_related_services(request.data)
        print("Parsed data:", data)
        
        serializer = self.get_serializer(data=data)
        
        if serializer.is_valid():
            blog = serializer.save()  # ✅ احصل على كائن المقال
            print("Created successfully with ID:", blog.id)
            
            # ✅ أعد البيانات كاملة مع التأكد من وجود الـ ID
            response_data = BlogReadSerializer(
                blog, context={'request': request}
            ).data
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        
        print("Create serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ── update (PUT / PATCH) ──────────────────
    def update(self, request, *args, **kwargs):
        print("\n===== UPDATE BLOG =====")
        print("Request data:", request.data)
        
        data = _parse_related_services(request.data)
        print("Parsed data:", data)
        
        partial = kwargs.pop('partial', True)  # ✅ خليها True دايمًا
        instance = self.get_object()
        
        serializer = self.get_serializer(instance, data=data, partial=partial)
        
        if serializer.is_valid():
            blog = serializer.save()  # ✅ احصل على الكائن المحدث
            print("Updated successfully with ID:", blog.id)
            
            # ✅ أعد البيانات كاملة
            response_data = BlogReadSerializer(
                blog, context={'request': request}
            ).data
            
            return Response(response_data)
        
        print("Update serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)