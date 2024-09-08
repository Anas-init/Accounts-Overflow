from rest_framework import serializers
from home.models import MyUser,Questions,Answers
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .utils import Utils
import os

    
class UserRegisterSerializer(serializers.ModelSerializer):
  # We are writing this becoz we need confirm password field in our Registration Request
  password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)
  class Meta:
    model = MyUser
    fields=['email', 'name', 'password', 'password2']
    extra_kwargs={
      'password':{'write_only':True}
    }

  # Validating Password and Confirm Password while Registration
  def validate(self, attrs):
    password = attrs.get('password')
    password2 = attrs.get('password2')
    if password != password2:
      raise serializers.ValidationError("Passwords doesn't match")
    return attrs

  def create(self, validated_data):
    if MyUser.objects.filter(name=validated_data.get('name')).exists():
      raise serializers.ValidationError("Username already exists")
    if MyUser.objects.filter(email=validated_data.get('email')).exists():
      raise serializers.ValidationError("Email already exists")
    return MyUser.objects.create_user(**validated_data)

class UserLoginSerializer(serializers.ModelSerializer):
  email=serializers.EmailField(max_length=255)
  class Meta:
    model=MyUser
    fields=['email', 'password']
    
class UserProfileSerializer(serializers.ModelSerializer):
  class Meta:
    model=MyUser
    fields=['email', 'name']
    
class UserChangePasswordSerializer(serializers.Serializer):
  password=serializers.CharField(style={'input_type':'password'}, write_only=True)
  password2=serializers.CharField(style={'input_type':'password'}, write_only=True)
  class Meta:
    fields=['password', 'password2']   
  def validate(self, attrs):
    password=attrs.get('password')
    password2=attrs.get('password2')
    user=self.context.get('user')
    if user.check_password(password):
          user.set_password(password2)
          user.save()
          return attrs
    raise serializers.ValidationError ("Incorrect old password")
class SendResetEmailSerializer(serializers.Serializer):
  email=serializers.EmailField(max_length=255)
  class Meta:
    fields=['email']
  def validate(self, attrs):
    email=attrs.get('email')
    if MyUser.objects.filter(email=email).exists():
      user=MyUser.objects.get(email=email)
      token=PasswordResetTokenGenerator().make_token(user)
      uid=urlsafe_base64_encode(force_bytes(user.id))
      link=f'http://127.0.0.1:8000/api/user/reset/{uid}/{token}'
      data={
        'email': user.email,
        'link': link,
        'subject': "Password Reset Link"
      }
      Utils.send_data(data)
      return attrs
    else:
      raise serializers.ValidationError("User is not registered")
    
      
class UserPasswordResetViewSerializer(serializers.Serializer):
  password=serializers.CharField(style={'input_type':'password'}, write_only=True)
  password2=serializers.CharField(style={'input_type':'password'}, write_only=True)  
  class Meta:
    fields=['password','password2'] 
  def validate(self,attrs):
    try:
      password=attrs.get('password')
      password2=attrs.get('password2')
      if password != password2:
        raise serializers.ValidationError("Token is Invalid")
      ID=smart_str(urlsafe_base64_decode(self.context.get('uid')))
      user=MyUser.objects.get(id=ID)
      token=self.context.get('token') 
      if not PasswordResetTokenGenerator().check_token(user, token):
        raise serializers.ValidationError("Token is invalid or expired")
      user.set_password(password)
      user.save()
      return attrs     
    except DjangoUnicodeDecodeError:
      PasswordResetTokenGenerator().check_token(user,token)
      raise serializers.ValidationError("Token is invalid")
    


class QuestionSerializer(serializers.ModelSerializer):
  que_csv_file=serializers.FileField(required=False)
  class Meta:
    model=Questions
    fields='__all__'
  def validate(self,attrs):
    request=self.context.get('request')
    if request and not request.user.is_authenticated:
      raise serializers.ValidationError("User must be logged in")
    else:
      return attrs
  def create(self, validated_data):
    request = self.context.get('request')
    try:
        file = validated_data['que_csv_file']
        file_extension = os.path.splitext(file.name)[1]  
        new_file_name = f"{os.path.splitext(file.name)[0]}_{request.user.id}{file_extension}"  
        file.name = new_file_name
        validated_data['que_csv_file'] = file
    except KeyError:
        pass
    validated_data['user'] = request.user
    return super().create(validated_data)
  def update(self, instance, validated_data):
    new_file = validated_data.get('que_csv_file')
    if new_file:
        old_file = instance.que_csv_file
        if old_file and os.path.isfile(old_file.path):
            old_file.delete(save=False)
    instance.question_text = validated_data.get('question_text', instance.question_text)
    instance.que_csv_file = new_file if new_file else instance.que_csv_file
    instance.save()
    return instance
  

    
class QuestionRecordSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    name = serializers.CharField(source='user.name', read_only=True)
    user_id=serializers.IntegerField(source='user.id', read_only=True)
    answers_count=serializers.SerializerMethodField()
    
    class Meta:
        model = Questions
        fields = ['email', 'name','user_id','id', 'question_text', 'tags','que_csv_file','answers_count']
    def get_answers_count(self,obj):
      results=Answers.objects.filter(question=obj)
      return results.count()
    
class AnswerSerializer(serializers.ModelSerializer):
  ans_csv_file=serializers.FileField(required=False)
  class Meta:
    model=Answers
    fields='__all__'
  def validate(self,attrs):
    request=self.context.get('request')
    if request and not request.user.is_authenticated:
      raise serializers.ValidationError("User must be logged in")
    else:
      return attrs   
  def create(self,validated_data):
    request = self.context.get('request')
    try:
        file = validated_data['ans_csv_file']
        file_extension = os.path.splitext(file.name)[1]  
        new_file_name = f"{os.path.splitext(file.name)[0]}_{request.user.id}{file_extension}"  
        file.name = new_file_name
        validated_data['ans_csv_file'] = file
    except KeyError:
        pass
    return super().create(validated_data)
  def update(self, instance, validated_data):
    new_file = validated_data.get('ans_csv_file')

    if new_file:
        old_file = instance.ans_csv_file
        if old_file and os.path.isfile(old_file.path):
            old_file.delete(save=False)
            
    instance.answer_text = validated_data.get('answer_text', instance.answer_text)
    instance.ans_csv_file = new_file if new_file else instance.ans_csv_file
    instance.votes = validated_data.get('votes', instance.votes)
    instance.save()
    return instance

class AnswerInfoSerializer(serializers.ModelSerializer):
  user=UserProfileSerializer(read_only=True)
  class Meta:
    model=Answers
    fields=['user', 'id','answer_text','total_views','votes','ans_csv_file']
    
class AnswerRecordSerializer(serializers.ModelSerializer):
  user= UserProfileSerializer(read_only=True)
  answers=serializers.SerializerMethodField()
  class Meta:
    model=Questions
    fields=['question_text','que_csv_file','tags','user','answers']
  def get_answers(self,obj):
      answers=Answers.objects.filter(question=obj)
      return AnswerInfoSerializer(answers,many=True).data
    
class TagsViewSerializer(serializers.ModelSerializer):
  class Meta:
    model=Questions
    fields=['tags']


class PartialAnswerSerializer(serializers.ModelSerializer):
  class Meta:
    model=Answers
    fields=['id','answer_text','ans_csv_file']
class PartialQuestionSerializer(serializers.ModelSerializer):
  class Meta:
    model=Questions
    fields=['id','question_text','que_csv_file']

class ProfileInfoViewSerializer(serializers.ModelSerializer):
  answers=serializers.SerializerMethodField()
  questions=serializers.SerializerMethodField()
  class Meta:
    model=MyUser
    fields=['id','name','email','answers','questions']
  def get_answers(self,obj):
    answers=Answers.objects.filter(user=obj)
    return PartialAnswerSerializer(answers,many=True).data
  def get_questions(self,obj):
    questions=Questions.objects.filter(user=obj)
    return PartialQuestionSerializer(questions,many=True).data