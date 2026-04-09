from rest_framework.viewsets import ModelViewSet
from ..models import FAQ
from ..serializers import FAQWriteSerializer
from rest_framework.permissions import IsAuthenticated
 
class FAQViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated] 
    queryset = FAQ.objects.all()
    serializer_class = FAQWriteSerializer