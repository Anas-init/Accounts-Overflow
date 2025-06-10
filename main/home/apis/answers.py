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
from math import ceil
from rest_framework import filters
from django.conf import settings
from home.utils import generate_descriptions,get_tokens_for_user
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

class AnswerView( APIView):
    renderer_classes = [BaseRenderer]
    def post(self,request,format=None):
        serializer=AnswerSerializer(data=request.data,context={'request':request})
        if serializer.is_valid():
            serializer.save()
            return Response({'msg':'Answer Posted Successfully'},status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    def get(self,request,format=None):
        question_id = request.query_params.get("id")
        download_csv=request.query_params.get("download_csv",'false').lower()=='true'
        answer_id=request.query_params.get("answer_id")
        if answer_id:
            try:
                answer=Answers.objects.get(id=answer_id)
                if download_csv:
                    file_path = os.path.join(settings.MEDIA_ROOT, answer.ans_csv_file.name)
                    if os.path.exists(file_path):
                        response = HttpResponse(answer.ans_csv_file, content_type='text/csv')
                        response.headers['Content-Disposition'] = f'attachment; filename="{answer.ans_csv_file.name}"'
                        response.headers['Access-Control-Allow-Origin'] = '*'
                        response.headers['Access-Control-Expose-Headers'] = 'Content-Disposition'
                        return response
                    else:
                        raise Response({'msg':"File not found"},status=status.HTTP_400_BAD_REQUEST)
            except Answers.DoesNotExist:
                return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)
        if not question_id:
            return Response({"error":'Question id not provided'},status=status.HTTP_400_BAD_REQUEST)
        try:
            question = Questions.objects.get(id=question_id)
            serializer = AnswerRecordSerializer(question)
            return Response({'data':serializer.data}, status=status.HTTP_200_OK)
        except Questions.DoesNotExist:
            return Response({"error": "Question record not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def put(self, request,format=None):
        answer_id=request.query_params.get('id')
        if request and not request.user.is_authenticated:
            return Response({'error': 'User is not authenticated'},status=status.HTTP_401_UNAUTHORIZED)
        if answer_id:
            try:
                answer=Answers.objects.get(id=answer_id)
                serializer=AnswerSerializer(answer,request.data,partial=True)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    return Response({'msg':'Answer updated succesfully'},status=status.HTTP_202_ACCEPTED)
                else:
                    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
            except Answers.DoesNotExist:
                return Response({"error":"Answer record not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error":"Answer id is not provided"},status=status.HTTP_404_NOT_FOUND)
    def delete(self, request,format=None):
        answer_id=request.query_params.get('id')
        if request and not request.user.is_authenticated:
            return Response({'error': 'User is not authenticated'},status=status.HTTP_401_UNAUTHORIZED)
        if answer_id:
            try:
                answer=Answers.objects.get(id=answer_id)
                os.remove(os.path.join(settings.MEDIA_ROOT, answer.ans_csv_file.name))
                answer.delete()
                return Response({'msg': 'Answer deleted successfully'},status=status.HTTP_200_OK)
            except Questions.DoesNotExist:
                return Response({"error":"Answer record not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error" : "Answer id not provided"}, status=status.HTTP_400_BAD_REQUEST)
