from django.urls import path
from .views import (
    LoginView, 
    RefreshTokenView, 
    LogoutView, 
    GetUserDataView,
    DashboardDataView
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', RefreshTokenView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
 
]