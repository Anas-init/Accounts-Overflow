from django.shortcuts import render , HttpResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from home.renderers import BaseRenderer
from .serializers import UserRegisterSerializer,UserLoginSerializer,UserProfileSerializer,UserChangePasswordSerializer,SendResetEmailSerializer,UserPasswordResetViewSerializer,QuestionSerializer,QuestionRecordSerializer,AnswerSerializer,AnswerRecordSerializer,TagsViewSerializer,ProfileInfoViewSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from home.models import Questions,Answers,MyUser
from math import ceil
from rest_framework import filters
from django.conf import settings
import jwt,os
import datetime,time
import uuid
from rapidfuzz import process,fuzz
import google.generativeai as genai
from env.credentials import API_KEY
from django.db.models.functions import Cast
from django.contrib.postgres.fields import ArrayField
from django.db.models import TextField
from collections import defaultdict
from rest_framework.parsers import FormParser,MultiPartParser
from django.http import FileResponse,HttpResponse
genai.configure(api_key=API_KEY)


def generate_descriptions(paragraph):
    prompt = f"""
    You are given a paragraph that contains multiple topics separated by commas. Your task is to provide a one-line description for each topic. 
    Beware Don't skip any description of topic remember that!
    If you skip any topic , this will harm your reputation.
    
    The format should be:
    Format:
    topic name: description

    Here is the paragraph:
    "{paragraph}"

    Now, please provide the one-line descriptions for each topic.
    Example:
    if the topics are machine learning etc. your response should be like this:
    
    - machine learning: A field of AI that enables computers to learn from data and improve performance over time without being explicitly programmed.
    - deep learning: A subset of machine learning involving neural networks with many layers, used for complex tasks like image and speech recognition. 
    - data science: An interdisciplinary field that uses statistical methods, algorithms, and systems to extract insights from data.
    """
    return prompt

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

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
                
                
            
            
        