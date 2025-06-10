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
from home.utils import generate_descriptions,get_tokens_for_user
from google.api_core.exceptions import ResourceExhausted,GoogleAPIError
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

class QuestionView(APIView):
    renderer_classes=[BaseRenderer]
    parser_classes=[FormParser,MultiPartParser]
    def post(self, request,format=None):
        serializer=QuestionSerializer(data=request.data,context={'request':request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'msg':'Question posted successfully'},status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    def get(self, request, format=None):
        question_id = request.query_params.get('question_id')
        download_csv = request.query_params.get('download_csv', 'false').lower() == 'true'

        if question_id:
            try:
                question = Questions.objects.get(pk=question_id)

                if download_csv:
                    file_path = os.path.join(settings.MEDIA_ROOT, question.que_csv_file.name)

                    if os.path.exists(file_path):
                        response = HttpResponse(question.que_csv_file, content_type='csv')
                        response.headers['Content-Disposition'] = f'attachment; filename="{question.que_csv_file.name}"'
                        response.headers['Access-Control-Allow-Origin'] = '*'
                        response.headers['Access-Control-Expose-Headers'] = 'Content-Disposition'
                        return response
                    else:
                        raise Response({'msg':"File not found"},status=status.HTTP_400_BAD_REQUEST)
            except Questions.DoesNotExist:
                return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

        # Paginated data retrieval
        data = []
        temp_list = []
        all_questions = Questions.objects.all().order_by('id')
        serializer = QuestionRecordSerializer(all_questions, many=True)
        for count, all in enumerate(serializer.data):
            temp_list.append(all)
            if (count + 1) % 10 == 0:
                data.append(temp_list)
                temp_list = []
        if len(temp_list) != 0:
            data.append(temp_list)

        return Response({
            "results": data,
        }, status=status.HTTP_200_OK)
    def put(self, request,format=None):
        question_id=request.query_params.get('id')
        if request and not request.user.is_authenticated:
            return Response({'error': 'User is not authenticated'},status=status.HTTP_401_UNAUTHORIZED)
        if question_id:
            try:
                question=Questions.objects.get(id=question_id)
                serializer=QuestionSerializer(question,request.data,partial=True)
                if serializer.is_valid(raise_exception=True):
                    serializer.save()
                    return Response({'msg':'Question updated succesfully'},status=status.HTTP_202_ACCEPTED)
                else:
                    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
            except Questions.DoesNotExist:
                return Response({"error":"Question record not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error":"Question id is not provided"},status=status.HTTP_404_NOT_FOUND)
    def delete(self, request,format=None):
        question_id=request.query_params.get('id')
        if request and not request.user.is_authenticated:
            return Response({'error': 'User is not authenticated'},status=status.HTTP_401_UNAUTHORIZED)
        if question_id:
            try:
                question=Questions.objects.get(id=question_id)
                os.remove(os.path.join(settings.MEDIA_ROOT, question.que_csv_file.name))
                question.delete()
                return Response({'msg': 'Question deleted successfully'},status=status.HTTP_200_OK)
            except Questions.DoesNotExist:
                return Response({"error":"Question record not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error" : "Question id not provided"}, status=status.HTTP_400_BAD_REQUEST)
class SearchView(APIView):
    renderer_classes = [BaseRenderer]
    search_fields = ['$question_text']
    filter_backends = [filters.SearchFilter]
    def get(self, request, format=None):
        queryset = Questions.objects.all()
        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(request, queryset, self)
        
        if not queryset.exists():
            query = request.query_params.get('search', '')
            all_questions = Questions.objects.values_list('question_text', flat=True)
            best_matches = process.extract(query, all_questions, scorer=fuzz.token_sort_ratio, limit=2)
            best_match_texts = [match[0] for match in best_matches]
            queryset = Questions.objects.filter(question_text__in=best_match_texts)
        serializer = QuestionRecordSerializer(queryset, many=True)
        if not serializer.data:
            return Response({'msg': 'no record matches your query'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.data, status=status.HTTP_200_OK)