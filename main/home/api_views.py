from django.shortcuts import render , HttpResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from home.renderers import BaseRenderer
from .serializers import UserRegisterSerializer,UserLoginSerializer,UserProfileSerializer,UserChangePasswordSerializer,SendResetEmailSerializer,UserPasswordResetViewSerializer,QuestionSerializer,QuestionRecordSerializer,AnswerSerializer,AnswerRecordSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from home.models import Questions,Answers
from rest_framework.pagination import PageNumberPagination
from math import ceil
from rest_framework import filters
from django.conf import settings
import jwt
import datetime
import uuid
from rapidfuzz import process,fuzz
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class GenerateAccessToken(APIView):
    def get(self, request, format=None):
        refresh_token = request.headers.get('token')
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
    
class CustomPaginator(PageNumberPagination):
    page_size = 10
    page_query_param = "page"


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
        
        
class QuestionView(APIView):
    renderer_classes=[BaseRenderer]
    def post(self, request,format=None):
        serializer=QuestionSerializer(data=request.data,context={'request':request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'msg':'Question posted successfully'},status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request,format=None):
        paginator=CustomPaginator()
        all_questions =Questions.objects.get_queryset().order_by('id')
        paginated_query=paginator.paginate_queryset(all_questions,request)
        page_size=paginator.get_page_size(request)
        total_count=all_questions.count()
        total_pages = ceil(total_count / page_size)
        current_page = int(request.query_params.get("page", 1))
        serializer=QuestionRecordSerializer(paginated_query,many=True)
        return Response({
            "count": total_count,
            "next": paginator.get_next_link(),
            "current_page": current_page,
            "previous": paginator.get_previous_link(),
            "first_page": 1,
            "last_page": total_pages,
            "results": serializer.data,
        },status=status.HTTP_200_OK)
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
        if not question_id:
            return Response({"error":'Question id not provided'},status=status.HTTP_400_BAD_REQUEST)
        try:
            question = Questions.objects.get(id=question_id)
            serializer = AnswerRecordSerializer(question)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Questions.DoesNotExist:
            return Response({"error": "Question record not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SearchView(APIView):
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
    search_fields = ['$tags']
    filter_backends = [filters.SearchFilter]
    def get(self, request,format=None):
        queryset = Questions.objects.all()
        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(request, queryset, self)
        serializer=QuestionRecordSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

        
        