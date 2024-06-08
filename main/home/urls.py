from django.urls import path,include
from .views import UserregistrationView
app_name="home"
urlpatterns = [
    path('register/',UserregistrationView.as_view(),name='register'),
    
]
