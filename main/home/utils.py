from django.core.mail import EmailMessage
import os
class Utils: 
    @staticmethod
    def send_data(data):
        email=EmailMessage(
            subject=data['subject'],
            body=data['link'],
            from_email=os.environ.get('EMAIL_FROM'),
            to=[data['email']],
        )
        email.send()