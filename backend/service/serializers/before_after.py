from rest_framework import serializers
from ..models import BeforeAfterImage

 
class BeforeAfterImageWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = BeforeAfterImage
        fields = '__all__'
        extra_kwargs = {
            'before_image': {'required': False, 'allow_null': True},
            'after_image': {'required': False, 'allow_null': True},
        }
    
    def update(self, instance, validated_data):
        if 'title' in validated_data:
            instance.title = validated_data['title']
        if 'description' in validated_data:
            instance.description = validated_data['description']
        if 'service' in validated_data:
            instance.service = validated_data['service']
        

        if 'before_image' in validated_data and validated_data['before_image']:
            instance.before_image = validated_data['before_image']
        if 'after_image' in validated_data and validated_data['after_image']:
            instance.after_image = validated_data['after_image']
        
        instance.save()
        return instance




class BeforeAfterImageReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = BeforeAfterImage
        fields = '__all__'


 

