
from rest_framework import serializers
from ..models import Package,PackageFeature


class PackageFeatureWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageFeature
        fields = '__all__'


class PackageFeatureReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageFeature
        fields = '__all__'

 

 

class PackageReadSerializer(serializers.ModelSerializer):
    features = PackageFeatureReadSerializer(many=True, read_only=True)
    class Meta:
        model = Package
        fields = '__all__'
 

class FeatureField(serializers.Field):
    """يقبل string أو dict فيه مفتاح 'feature'"""
    def to_internal_value(self, data):
        if isinstance(data, str):
            return data.strip()
        if isinstance(data, dict) and 'feature' in data:
            return data['feature'].strip()
        raise serializers.ValidationError("قيمة غير صحيحة للـ feature")

    def to_representation(self, value):
        return value


class PackageWriteSerializer(serializers.ModelSerializer):
    features = serializers.ListField(
        child=FeatureField(),
        write_only=True
    )

    class Meta:
        model = Package
        fields = ['id', 'name', 'price', 'popular', 'features']

    def create(self, validated_data):
        features = validated_data.pop('features', [])
        package = Package.objects.create(**validated_data)
        for feature in features:
            if feature:
                PackageFeature.objects.create(package=package, feature=feature)
        return package

    def update(self, instance, validated_data):
        features = validated_data.pop('features', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if features is not None:
            instance.features.all().delete()
            for feature in features:
                if feature:
                    PackageFeature.objects.create(package=instance, feature=feature)

        return instance