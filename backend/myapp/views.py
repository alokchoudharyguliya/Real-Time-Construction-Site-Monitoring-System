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
from .models import User
from .serializers import UserSerializer

def home(request):
    return JsonResponse({'message': 'Welcome to Django API!'})

def hello_world(request):
    return JsonResponse({'message': 'Hello, World!'})

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

@csrf_exempt
@require_http_methods(["GET", "POST"])
def user_list(request):
    collection = get_users_collection()
    
    if request.method == 'GET':
        # Get all users
        users = list(collection.find())
        return JsonResponse(json.loads(dumps(users)), safe=False)
    
    elif request.method == 'POST':
        # Create a new user
        try:
            data = json.loads(request.body)
            user_data = {
                'name': data.get('name'),
                'email': data.get('email'),
                'age': data.get('age'),
                'user_type': data.get('user_type', 'contractor')  # <-- add user_type, default to contractor
            
            }
            if user_data['user_type'] not in ['contractor', 'inspector']:
                return JsonResponse({'error': 'Invalid user_type. Must be contractor or inspector.'}, status=400)
            
            
            # Check if user with email already exists
            if collection.find_one({'email': user_data['email']}):
                return JsonResponse({'error': 'User with this email already exists'}, status=400)
            
            result = collection.insert_one(user_data)
            return JsonResponse({
                'message': 'User created successfully',
                'id': str(result.inserted_id)
            }, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
def user_detail(request, user_id):
    collection = get_users_collection()
    
    try:
        obj_id = ObjectId(user_id)
    except:
        return JsonResponse({'error': 'Invalid user ID'}, status=400)
    
    if request.method == 'GET':
        # Get a specific user
        user = collection.find_one({'_id': obj_id})
        if user:
            return JsonResponse(json.loads(dumps(user)), safe=False)
        else:
            return JsonResponse({'error': 'User not found'}, status=404)
    
    elif request.method == 'PUT':
        # Update a user
        try:
            data = json.loads(request.body)
            update_data = {}
            
            if 'name' in data:
                update_data['name'] = data['name']
            if 'email' in data:
                update_data['email'] = data['email']
            if 'age' in data:
                update_data['age'] = data['age']
            if 'user_type' in data:
                if data['user_type'] not in ['contractor', 'inspector']:
                    return JsonResponse({'error': 'Invalid user_type. Must be contractor or inspector.'}, status=400)
                update_data['user_type'] = data['user_type']  # <-- validate and update user_type
            
            result = collection.update_one(
                {'_id': obj_id},
                {'$set': update_data}
            )
            
            if result.matched_count:
                return JsonResponse({'message': 'User updated successfully'})
            else:
                return JsonResponse({'error': 'User not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    
    elif request.method == 'DELETE':
        # Delete a user
        result = collection.delete_one({'_id': obj_id})
        if result.deleted_count:
            return JsonResponse({'message': 'User deleted successfully'})
        else:
            return JsonResponse({'error': 'User not found'}, status=404)