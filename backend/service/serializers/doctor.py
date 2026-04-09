from rest_framework import serializers
from ..models import Doctor

 
 
class DoctorReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'


 
class DoctorWriteSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Doctor
        fields = ['id', 'name', 'title', 'image', 'experience', 'instagram']

    def create(self, validated_data):
        return Doctor.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.title = validated_data.get('title', instance.title)
        instance.experience = validated_data.get('experience', instance.experience)
        instance.instagram = validated_data.get('instagram', instance.instagram)

        # تحديث الصورة فقط لو اتبعتت
        if 'image' in validated_data:
            instance.image = validated_data.get('image')

        instance.save()
        return instance

