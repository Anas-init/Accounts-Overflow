from django.shortcuts import render , HttpResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from home.renderers import BaseRenderer
from home.serializers import UserRegisterSerializer,UserLoginSerializer,UserProfileSerializer,UserChangePasswordSerializer,SendResetEmailSerializer,UserPasswordResetViewSerializer,QuestionSerializer,QuestionRecordSerializer,AnswerSerializer,AnswerRecordSerializer,TagsViewSerializer,ProfileInfoViewSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from home.models import Questions,Answers,MyUser
from google.api_core.exceptions import ResourceExhausted,GoogleAPIError
from home.utils import generate_descriptions,get_tokens_for_user
from math import ceil
from rest_framework import filters
from django.conf import settings
import jwt,os
import datetime,time
import uuid
from rapidfuzz import process,fuzz
import google.generativeai as genai

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.db.models.functions import Cast
from django.contrib.postgres.fields import ArrayField
from django.db.models import TextField
from collections import defaultdict
from rest_framework.parsers import FormParser,MultiPartParser
from django.http import FileResponse,HttpResponse

class GenerateAccessToken(APIView):
    def get(self, request, format=None):
        refresh_token = request.query_params.get('token')
        if not refresh_token:
            return Response({'error': 'Refresh token is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Refresh token has expired.'}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid refresh token.'}, status=status.HTTP_401_UNAUTHORIZED)
        current_time = datetime.datetime.now(datetime.timezone.utc)
        expiration_time = current_time + datetime.timedelta(minutes=10)
        new_access_token_payload = {
            'token_type': 'access',
            'exp': int(expiration_time.timestamp()),  # Expiration time
            'iat': int(current_time.timestamp()),     # Issued at time
            'jti': str(uuid.uuid4()),                # Unique identifier
            'user_id': payload['user_id']
        }
        new_access_token = jwt.encode(new_access_token_payload, settings.SECRET_KEY, algorithm='HS256')
        return Response({'access_token': new_access_token}, status=status.HTTP_200_OK)


class UserregistrationView(APIView):
    renderer_classes=[BaseRenderer]
    
    def post(self, request,format=None):  
        print(os.getenv('USER'))
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
    def delete(self, request):
        user_id=request.query_params.get('id')
        if user_id:
            try:
                user=MyUser.objects.get(id=user_id)
                if user:
                    answer_items=Answers.objects.filter(user=request.user)
                    for answer in answer_items:
                        os.remove(os.path.join(settings.MEDIA_ROOT, answer.ans_csv_file.name))
                    question_items=Questions.objects.filter(user=request.user)
                    for question in question_items:
                        os.remove(os.path.join(settings.MEDIA_ROOT,question.que_csv_file.name))
                    user.delete()
                    return Response({'msg': 'User deleted successfully'},status=status.HTTP_200_OK)
                else:
                    return Response({'error':'User not found'},status=status.HTTP_404_NOT_FOUND)
            except MyUser.DoesNotExist:
                return Response({'error':'User does not exist'},status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error':'user id not provided'},status=status.HTTP_400_BAD_REQUEST)
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
        

class UserProfileInfoView(APIView):
    renderer_classes = [BaseRenderer]
    def get(self, request, format=None):
        username=request.query_params.get('username')
        if username is not None:
            user=MyUser.objects.get(name=username)
            if user is not None:
                serializer=ProfileInfoViewSerializer(user)
                if request and request.user.is_authenticated and request.user.name == user.name:
                    return Response({'data': serializer.data,'flag': True},status=status.HTTP_200_OK)
                else:
                    return Response({'data':serializer.data,'flag':False},status=status.HTTP_200_OK)
            else:
                return Response({'msg': 'Invalid username'},status=status.HTTP_404_NOT_FOUND)
        else:
            if request and not request.user.is_authenticated:
                return Response({'msg': 'You must be logged in'},status=status.HTTP_401_UNAUTHORIZED)
            else:
                serializer=ProfileInfoViewSerializer(request.user)
                return Response({'data': serializer.data,'flag':True},status=status.HTTP_200_OK)
                