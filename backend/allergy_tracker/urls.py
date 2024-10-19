from django.urls import path
from . import views

# maps URLs to views
urlpatterns = [
    path('', views.home, name='home'),  
    # add app's URL patterns here later
]