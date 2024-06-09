from django.urls import path,include
from .views import UserregistrationView,UserLogin
app_name="home"
urlpatterns = [
    path('register/',UserregistrationView.as_view(),name='register'),
    path('login/',UserLogin.as_view(),name='login'),
    
    
]
