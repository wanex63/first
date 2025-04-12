from rest_framework import serializers
from .models import Film
from django.utils import timezone
from django.contrib.auth.models import User

class FilmSerializer(serializers.ModelSerializer):
    age = serializers.SerializerMethodField()
    genre_display = serializers.CharField(source='get_genre_display', read_only=True)

    class Meta:
        model = Film
        fields = [
            'id', 'title', 'year', 'description', 'genre', 'genre_display',
            'duration', 'rating', 'poster_url', 'is_published', 'age',
            'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'rating': {'required': False},
            'duration': {'min_value': 1}
        }

    def get_age(self, obj):
        return timezone.now().year - obj.year

    def validate_year(self, value):
        if value < 1895:
            raise serializers.ValidationError("The first film was made in 1895!")
        if value > timezone.now().year + 2:
            raise serializers.ValidationError("Year cannot be in the future!")
        return value

    def validate(self, data):
        if data['genre'] == 'horror' and data.get('rating', 0) > 8.0:
            raise serializers.ValidationError("Horror films rarely have such high ratings!")
        return data

class RegisterSerializer(serializers.ModelSerializer):
    # Добавляем поле подтверждения пароля
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True},  # Пароль должен быть только для записи
        }

    def validate_password2(self, value):
        # Проверяем, совпадает ли подтверждение пароля
        if value != self.initial_data['password']:
            raise serializers.ValidationError("Пароли не совпадают")
        return value

    def create(self, validated_data):
        # Убираем пароль2, так как он нам не нужен для создания пользователя
        validated_data.pop('password2')

        # Создаем пользователя
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user