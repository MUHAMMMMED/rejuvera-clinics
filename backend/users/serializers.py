from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()  
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                raise serializers.ValidationError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
            user = authenticate(username=user.username, password=password)
            
            if not user:
                raise serializers.ValidationError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
            
            if not user.is_active:
                raise serializers.ValidationError('هذا الحساب غير مفعل')
        else:
            raise serializers.ValidationError('يجب إدخال البريد الإلكتروني وكلمة المرور')

        data['user'] = user
        return data


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'first_name', 'last_name']
    
    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username