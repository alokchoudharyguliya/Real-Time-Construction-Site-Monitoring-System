from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from django.conf import settings
from django.core.files.storage import default_storage
import requests
from django.contrib.auth import authenticate, get_user_model

from .utils import (
    generate_jwt_token,
    JSONEncoder
)
from .utils import verify_jwt_token
User = get_user_model()

@csrf_exempt
@require_http_methods(["POST"])
def signup(request):
    try:
        data = json.loads(request.body)

        # Validate required fields
        required_fields = ['username', 'password', 'email','account_type']
        for field in required_fields:
            if field not in data:
                return JsonResponse({'error': f'{field} is required'}, status=400)

        # Check if user already exists
        if User.objects.filter(username=data['username']).exists() or User.objects.filter(email=data['email']).exists():
            return JsonResponse({'error': 'User with this username/email already exists'}, status=400)
        print(data)
        # Create Django user
        user = User(username=data['username'], email=data['email'],account_type=data['account_type'])
        # optional fields
        user.name = data.get('name', '') if hasattr(user, 'name') else None
        user.set_password(data['password'])
        user.save()

        token = generate_jwt_token(user.pk, user.email)

        user_data = {
            'id': user.pk,
            'username': user.username,
            'email': user.email,
            'name': getattr(user, 'name', None),
            'account_type': getattr(user, 'account_type', None),
        }

        return JsonResponse({'message': 'User created successfully', 'user': user_data, 'token': token}, status=201, encoder=JSONEncoder)
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    try:
        data = json.loads(request.body)

        # Accept username or email
        identifier = data.get('username') or data.get('email')
        if not identifier or 'password' not in data:
            return JsonResponse({'error': 'username/email and password are required'}, status=400)

        # Try authenticate via username first then email
        user = authenticate(request, username=data.get('username'), password=data['password'])
        if user is None and data.get('email'):
            # find user by email
            try:
                user_obj = User.objects.get(email=data.get('email'))
                user = authenticate(request, username=user_obj.username, password=data['password'])
            except User.DoesNotExist:
                user = None

        if user is None:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)

        token = generate_jwt_token(user.pk, user.email)

        user_data = {
            'id': user.pk,
            'username': user.username,
            'email': user.email,
            'name': getattr(user, 'name', ""),
            'account_type':getattr(user, 'account_type'),
        }

        return JsonResponse({'message': 'Login successful', 'user': user_data, 'token': token}, encoder=JSONEncoder)
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(["GET"])
def profile(request):
    try:
        # Expect a JWT in Authorization header: Bearer <token>
        auth = request.headers.get('Authorization') or request.META.get('HTTP_AUTHORIZATION')
        if not auth or not auth.startswith('Bearer '):
            return JsonResponse({'error': 'Authentication required'}, status=401)
        token = auth.split(' ', 1)[1]
        payload = verify_jwt_token(token)
        if not payload:
            return JsonResponse({'error': 'Invalid or expired token'}, status=401)

        user_id = payload.get('user_id')
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        user_data = {
            'id': user.pk,
            'username': user.username,
            'email': user.email,
            'name': getattr(user, 'name', None),
            'role': getattr(user, 'role', None),
        }

        return JsonResponse({'user': user_data}, encoder=JSONEncoder)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
