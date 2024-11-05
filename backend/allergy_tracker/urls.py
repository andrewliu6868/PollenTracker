from django.urls import path, include
from allergy_tracker.views import CreateUserView, CreateSymptomEntryView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


# maps URLs to views
urlpatterns = [
    path('user/register/', CreateUserView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('journal/', CreateSymptomEntryView.as_view(), name='journal-entry'),
]