from rest_framework.viewsets import ModelViewSet
from ..models import GalleryImage
from ..serializers import GalleryImageWriteSerializer
from rest_framework.permissions import IsAuthenticated
 
class GalleryImageViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated] 
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageWriteSerializer
 