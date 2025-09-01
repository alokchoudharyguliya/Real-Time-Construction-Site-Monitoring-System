from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from bson import ObjectId
from bson.json_util import dumps
from .utils import get_users_collection
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
# from .models import User
# from .serializers import UserSerializer

def home(request):
    return JsonResponse({'message': 'Welcome to Django API!'})

def hello_world(request):
    return JsonResponse({'message': 'Hello, World!'})

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)