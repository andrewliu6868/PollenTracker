from django.urls import path, include
from allergy_tracker.views import CreateUserView, CreateSymptomEntryView, JournalEntryListView, WeeklyJournalEntryListView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import get_medications, add_medication, update_medication, delete_medication, register_device_token

# maps URLs to views
urlpatterns = [
    path('user/register/', CreateUserView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='get_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('journal/create/', CreateSymptomEntryView.as_view(), name='journal-entry-create'),
    path('journal/', JournalEntryListView.as_view(), name='journal-entry-list'),
    path('journal/weekly/', WeeklyJournalEntryListView.as_view(), name='journal-entry-weekly-list'),
    path('medications/', get_medications, name='get_medications'),
    path('medications/add/', add_medication, name='add_medication'),
    path('medications/<int:pk>/', update_medication, name='update_medication'),
    path('medications/delete/<int:pk>/', delete_medication, name='delete_medication'),
    path('register-device-token/', register_device_token, name='register_device_token'),
]
