from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from .api_views import UserregistrationView,UserLogin,UserProfileView,UserChangePasswordView,UserResetSendEmailView,UserPasswordResetView,QuestionView,AnswerView,SearchView,GenerateAccessToken,TagsView,TagsRecordView,UserProfileInfoView
app_name="home"
urlpatterns = [
    #User APIs
    path('register/',UserregistrationView.as_view(),name='register'),
    path('login/',UserLogin.as_view(),name='login'),
    path('profile/',UserProfileView.as_view(),name='profile'),
    path('change/',UserChangePasswordView.as_view(),name='change'),
    path('reset/',UserResetSendEmailView.as_view(),name='reset'),
    path('reset/<uid>/<token>/',UserPasswordResetView.as_view(),name='password_reset'),
    path('refresh/',GenerateAccessToken.as_view(),name='password_reset'),
    path('profileinfo/',UserProfileInfoView.as_view(),name='profile-info'),
    
    
    #Question APIs
    path('allquestion/',QuestionView.as_view(),name='all-question'),
    path('question/',QuestionView.as_view(),name='questions-list'),
    path('update-question/',QuestionView.as_view(),name='update-question'),
    path('delete-question/',QuestionView.as_view(),name='delete-question'),
    
    #ANSWER APIs
    path('allanswer/',AnswerView.as_view(),name='all-answer'),
    path('answer/',AnswerView.as_view(),name='create-answer'),
    path('update-answer/',AnswerView.as_view(),name='update-answer'),
    path('delete-answer/',AnswerView.as_view(),name='delete-answer'),
    #SEARCH APIs
    path('lookup/',SearchView.as_view(),name='search-question'),

    #TAGS APIS
    path('tags/',TagsView.as_view(),name='tag-questions'),
    path('alltags/',TagsRecordView.as_view(),name='tag-all-tags'),
    
    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
