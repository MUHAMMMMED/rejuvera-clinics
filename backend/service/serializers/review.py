from rest_framework import serializers
from ..models import Review

from rest_framework import serializers
from ..models import Review

class ReviewWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'
        extra_kwargs = {
            'image': {'required': False, 'allow_null': True},
        }
    
    def update(self, instance, validated_data):
        # تحديث الحقول فقط إذا كانت موجودة
        if 'service' in validated_data:
            instance.service = validated_data['service']
        if 'image' in validated_data and validated_data['image']:
            instance.image = validated_data['image']
        
        instance.save()
        return instance
    
class ReviewReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'


