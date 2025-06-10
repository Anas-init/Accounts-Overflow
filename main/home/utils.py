from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings



def generate_descriptions(paragraph):
    prompt = f"""
    You are given a list of topics separated by commas. Your task is to provide a concise one-line description for each topic.
    
    For each topic, follow this exact format:
    - [TOPIC]: [DESCRIPTION]
    
    Important:
    1. Include descriptions for ALL topics provided
    2. Maintain the exact format with the hyphen, space, topic, colon, space, and description
    3. Each topic-description pair should be on its own line
    4. Do not skip any topics
    5. Do not add any additional explanatory text before or after the descriptions
    
    Here are the topics:
    {paragraph}
    """
    return prompt
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

