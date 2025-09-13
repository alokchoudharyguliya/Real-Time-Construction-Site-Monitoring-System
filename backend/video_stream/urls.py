# video_stream/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('video_feed', views.video_feed, name='video_feed'),
    path('process_frame', views.process_frame, name='process_frame'),
]

# webcam_project/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('video_stream.urls')),
]