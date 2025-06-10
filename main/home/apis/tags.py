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
from home.utils import generate_descriptions,get_tokens_for_user
from home.models import Questions,Answers,MyUser
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
from home.credentials import API_KEY
genai.configure(api_key=API_KEY)

class TagsView(APIView):
    renderer_classes = [BaseRenderer]
    search_fields = ['$tags']
    filter_backends = [filters.SearchFilter]
    def get(self, request,format=None):
        queryset = Questions.objects.all()
        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(request, queryset, self)
        serializer=QuestionRecordSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
class TagsRecordView(APIView):
    renderer_classes = [BaseRenderer]
    def get(self, request, format=None):
        model = genai.GenerativeModel('gemini-1.0-pro-latest')
        strip_values = '"\'\n\''
        queryset = Questions.objects.values_list('tags', flat=True)
        alltags = ""
        real_data = []
        
        for item in queryset:
            split_values = item.split(',')
            cleaned_values = [value.strip().strip(strip_values) for value in split_values]
            for value in cleaned_values:
                alltags += value + ','
            real_data.extend(cleaned_values)
        
        alltags = alltags.rstrip(',')  

        response = model.generate_content(generate_descriptions(alltags))
        response_text = response.text

        lines = response_text.strip().split('\n')
        result_dict = {}
        for line in lines:
            key, value = line.split(': ', 1)
            result_dict[key.strip()] = value.strip()
        tag_counts = defaultdict(int)
        for item in queryset:
            tags = [tag.strip().strip(strip_values) for tag in item.split(',')]
            for tag in tags:
                tag_counts[tag] += 1
    
        final_data = []
        for tag in tag_counts:
            hyphen_space_tag="- "
            hyphen_space_tag+=tag
            final_data.append({
                'tag': tag,
                'count': tag_counts[tag],
                'description': result_dict.get(hyphen_space_tag)
            })
        
        return Response({'tags': final_data}, status=status.HTTP_200_OK)