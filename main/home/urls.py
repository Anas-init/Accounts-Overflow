from django.urls import path,include
from .views import UserregistrationView,UserLogin,UserProfileView,UserChangePasswordView,UserResetSendEmailView,UserPasswordResetView
app_name="home"
urlpatterns = [
    path('register/',UserregistrationView.as_view(),name='register'),
    path('login/',UserLogin.as_view(),name='login'),
    path('profile/',UserProfileView.as_view(),name='profile'),
    path('change/',UserChangePasswordView.as_view(),name='change'),
    path('reset/',UserResetSendEmailView.as_view(),name='reset'),
    path('reset/<uid>/<token>/',UserPasswordResetView.as_view(),name='password_reset'),
]
