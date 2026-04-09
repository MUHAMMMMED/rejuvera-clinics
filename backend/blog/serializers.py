from rest_framework import serializers
from .models import Blog
from service.models import Service
from service.serializers import ServiceWriteSerializer
 
 
class BlogWriteSerializer(serializers.ModelSerializer):
    """Serializer للكتابة – يقبل قائمة IDs للخدمات."""
    related_services = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        many=True,
        required=False,
    )

    class Meta:
        model = Blog
        fields = [
            'id', 'title', 'summary', 'content',
            'related_services',
        ]

    def to_representation(self, instance):
        """بعد الحفظ، أرجع البيانات بصيغة القراءة الكاملة."""
        return BlogReadSerializer(instance, context=self.context).data

 

class BlogListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['id', 'title', 'summary', 'created_at']



class BlogReadSerializer(serializers.ModelSerializer):
    related_services= ServiceWriteSerializer(many=True, read_only=True)
    class Meta:
        model = Blog
        fields = '__all__'


