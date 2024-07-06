from django.shortcuts import render , HttpResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from home.renderers import BaseRenderer
from .serializers import UserRegisterSerializer,UserLoginSerializer,UserProfileSerializer,UserChangePasswordSerializer,SendResetEmailSerializer,UserPasswordResetViewSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserregistrationView(APIView):
    renderer_classes=[BaseRenderer]
    def post(self, request,format=None):  
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user=serializer.save()
            token=get_tokens_for_user(user)
            msg={'token':token,'message':'registration successful'}
            return Response(msg,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
class UserLogin(APIView):
    renderer_classes=[BaseRenderer]
    def post(self, request,format=None):  
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email=request.data.get('email')
            password=request.data.get('password')
            user=authenticate(email=email,password=password)
            if user is not None:
                token=get_tokens_for_user(user)
                msg={'token':token,'message': 'Login Succesfull'}
                return Response(msg,status=status.HTTP_201_CREATED)
            else:
                msg={'message': 'Invalid Credentials'}
                return Response(msg,status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class UserProfileView(APIView):
    renderer_classes=[BaseRenderer]
    permission_classes=[IsAuthenticated]
    def get(self, request):
        serializer=UserProfileSerializer(request.user)
        return Response(serializer.data,status=status.HTTP_200_OK)
class UserChangePasswordView(APIView):
    renderer_classes=[BaseRenderer]
    permission_classes=[IsAuthenticated]
    def post(self, request,format=None):
        serializer=UserChangePasswordSerializer(data=request.data,context={'user': request.user})
        if serializer.is_valid():
            return Response({'msg': 'password changed successfully'},status=status.HTTP_202_ACCEPTED)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
class UserResetSendEmailView(APIView):
    renderer_classes=[BaseRenderer]
    def post(self, request,format=None):
        serializer=SendResetEmailSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'reset email sent successfully'},status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
class UserPasswordResetView(APIView):
    renderer_classes=[BaseRenderer]
    def post(self, request,uid,token,format=None):
        serializer=UserPasswordResetViewSerializer(data=request.data,context={'token':token,'uid':uid})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'password reset successfully'},status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
