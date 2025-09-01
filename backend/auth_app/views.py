from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from bson import ObjectId

from .utils import (
    get_users_collection, 
    hash_password, 
    verify_password, 
    generate_jwt_token,
    verify_jwt_token,
    JSONEncoder
)

@csrf_exempt
@require_http_methods(["POST"])
def signup(request):
    try:
        data = json.loads(request.body)
        collection = get_users_collection()
        
        # Validate required fields
        required_fields = ['email', 'password', 'name','account_type']
        for field in required_fields:
            if field not in data:
                return JsonResponse({'error': f'{field} is required'}, status=400)
        
        # Check if user already exists
        if collection.find_one({'email': data['email']}):
            return JsonResponse({'error': 'User with this email already exists'}, status=400)
        
        # Hash password
        hashed_password = hash_password(data['password'])
        
        # Create user document
        user_data = {
            'name': data['name'],
            'email': data['email'],
            'password': hashed_password,
            'age': data.get('age'),
            'created_at': ObjectId().generation_time,
            'account_type':data['account_type']
        }
        
        # Insert user
        result = collection.insert_one(user_data)
        user_id = result.inserted_id
        
        # Generate JWT token
        token = generate_jwt_token(user_id, data['email'])
        
        # Return response without password
        user_data.pop('password', None)
        user_data['_id'] = str(user_id)
        if 'created_at' in user_data and user_data['created_at']:
            user_data['created_at'] = user_data['created_at'].isoformat()
        
        return JsonResponse({
            'message': 'User created successfully',
            'user': user_data,
            'token': token
        }, status=201, encoder=JSONEncoder)
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    try:
        data = json.loads(request.body)
        print(data)
        collection = get_users_collection()
        
        # Validate required fields
        if 'email' not in data or 'password' not in data:
            return JsonResponse({'error': 'Email and password are required'}, status=400)
        
        # Find user by email
        user = collection.find_one({'email': data['email']})
        if not user:
            return JsonResponse({'error': 'Invalid email or password'}, status=401)
        
        # Verify password
        if not verify_password(data['password'], user['password']):
            return JsonResponse({'error': 'Invalid email or password'}, status=401)
        
        # Generate JWT token
        token = generate_jwt_token(user['_id'], user['email'])
        
        # Prepare user data without password
        user_data = {
            '_id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'age': user.get('age'),
            'created_at': user.get('created_at').isoformat(),
            'account_type':user['account_type']
        }
        
        return JsonResponse({
            'message': 'Login successful',
            'user': user_data,
            'token': token
        }, encoder=JSONEncoder)
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(["GET"])
def profile(request):
    try:
        collection = get_users_collection()
        user_id = getattr(request, 'user_id', None)
        
        if not user_id:
            return JsonResponse({'error': 'Authentication required'}, status=401)
        
        user = collection.find_one({'_id': ObjectId(user_id)})
        if not user:
            return JsonResponse({'error': 'User not found'}, status=404)
        
        # Prepare user data without password
        user_data = {
            '_id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'age': user.get('age'),
            'created_at': user.get('created_at')
        }
        
        return JsonResponse({
            'user': user_data
        }, encoder=JSONEncoder)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["PUT"])
def update_profile(request):
    try:
        data = json.loads(request.body)
        collection = get_users_collection()
        user_id = getattr(request, 'user_id', None)
        
        if not user_id:
            return JsonResponse({'error': 'Authentication required'}, status=401)
        
        # Prepare update data
        update_data = {}
        if 'name' in data:
            update_data['name'] = data['name']
        if 'age' in data:
            update_data['age'] = data['age']
        if 'password' in data and data['password']:
            update_data['password'] = hash_password(data['password'])
        
        if not update_data:
            return JsonResponse({'error': 'No valid fields to update'}, status=400)
        
        # Update user
        result = collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return JsonResponse({'error': 'User not found'}, status=404)
        
        # Get updated user
        user = collection.find_one({'_id': ObjectId(user_id)})
        user_data = {
            '_id': str(user['_id']),
            'name': user['name'],
            'email': user['email'],
            'age': user.get('age'),
            'created_at': user.get('created_at')
        }
        
        return JsonResponse({
            'message': 'Profile updated successfully',
            'user': user_data
        }, encoder=JSONEncoder)
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)