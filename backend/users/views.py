from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer 
from django.contrib.auth import get_user_model

User = get_user_model()

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # إنشاء التوكنز
            refresh = RefreshToken.for_user(user)
            
            # تنسيق الاستجابة كما يطلبها الـ Frontend
            return Response({
                'access_token': str(refresh.access_token),  # مفتاح access_token
                'refresh_token': str(refresh),              # مفتاح refresh_token
                'email': user.email,
                'full_name': user.get_full_name() or user.username,
                'id': user.id
            }, status=status.HTTP_200_OK)
        
        # إرجاع 400 مع رسالة خطأ
        return Response(
            {'error': 'البريد الإلكتروني أو كلمة المرور غير صحيحة'}, 
            status=status.HTTP_400_BAD_REQUEST
        )


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        refresh_token = request.data.get('refresh')
        
        if not refresh_token:
            return Response(
                {'error': 'Refresh token is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            
            return Response({
                'access_token': access_token
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {'error': 'Invalid refresh token'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()  # يتطلب تفعيل blacklist
            return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetUserDataView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'email': user.email,
            'full_name': user.get_full_name() or user.username,
            'first_name': user.first_name,
            'last_name': user.last_name
        }, status=status.HTTP_200_OK)

 
class DashboardDataView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        data = {
            'message': 'مرحباً بك في لوحة التحكم',
            'statistics': {
                'total_orders': 150,
                'total_products': 45,
                'total_customers': 89
            }
        }
        return Response(data, status=status.HTTP_200_OK)