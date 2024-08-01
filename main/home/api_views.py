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
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
    
    
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
        all_questions =Questions.objects.all()
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