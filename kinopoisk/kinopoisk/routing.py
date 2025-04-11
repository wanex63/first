from django.urls import re_path
from .consumers import FilmConsumer
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project.settings')

websocket_urlpatterns = [
    re_path(r'ws/films/$', FilmConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(
        websocket_urlpatterns  # Импортируется из предыдущего примера
    ),
})