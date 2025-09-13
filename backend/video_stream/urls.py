# video_stream/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('video_feed/', views.video_feed, name='video_feed'),
    path('process_frame', views.process_frame, name='process_frame'),
]

