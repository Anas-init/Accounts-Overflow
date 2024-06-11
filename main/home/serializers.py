from rest_framework import serializers
from home.models import MyUser
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .utils import Utils

    
class UserRegisterSerializer(serializers.ModelSerializer):
  # We are writing this becoz we need confirm password field in our Registratin Request
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

  def create(self, validate_data):
    return MyUser.objects.create_user(**validate_data)

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
    if(password != password2):
      raise serializers.ValidationError("Password mismatch")
    user.set_password(password)
    user.save()
    return attrs

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
      return serializers.ValidationError("User is not registered")
    
      
    
    