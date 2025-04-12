from django.contrib import admin
from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, UserView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('films.urls')),  # Ваши API пути для фильмов
    # Документация API (только для разработки)
    path('docs/', include_docs_urls(
        title='Kinopoisk API',
        public=False,
        permission_classes=[]  # Разрешаем доступ без авторизации
    )),
    # Путь для получения JWT токенов
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Путь для регистрации и получения информации о пользователе
    path('register/', RegisterView.as_view(), name='register'),
    path('user/', UserView.as_view(), name='user'),
]
