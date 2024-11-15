from django.urls import path, include
from allergy_tracker.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import get_medications, add_medication, update_medication, delete_medication, register_device_token

# maps URLs to views
urlpatterns = [
    path('user/register/', CreateUserView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('medications/', get_medications, name='get_medications'),
    path('medications/add/', add_medication, name='add_medication'),
    path('medications/<int:pk>/', update_medication, name='update_medication'),
    path('medications/delete/<int:pk>/', delete_medication, name='delete_medication'),
    path('register-device-token/', register_device_token, name='register_device_token'),
]
