from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

class RegisterView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Email и пароль обязательны'}, status=400)

        if User.objects.filter(username=email).exists():  # Проверка по email, если email используется как username
            return Response({'error': 'Пользователь уже существует'}, status=400)

        user = User.objects.create_user(username=email, email=email, password=password)
        return Response({'message': 'Пользователь создан успешно'}, status=status.HTTP_201_CREATED)

class UserView(APIView):
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

# Новый View для логина с использованием JWT
class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Email и пароль обязательны'}, status=400)

        # Аутентификация по email
        user = authenticate(username=email, password=password)
        if user is None:
            return Response({'error': 'Неверный email или пароль'}, status=400)

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        return Response({'access': access_token, 'refresh': refresh_token}, status=status.HTTP_200_OK)
