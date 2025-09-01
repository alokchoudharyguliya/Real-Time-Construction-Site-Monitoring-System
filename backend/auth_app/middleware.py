from django.http import JsonResponse
from .utils import verify_jwt_token

class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Skip authentication for these paths
        if request.path in ['/api/auth/signup/', '/api/auth/login/']:
            return self.get_response(request)
        
        # Check for token in Authorization header
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Authentication credentials not provided'}, status=401)
        
        token = auth_header.split(' ')[1]
        payload = verify_jwt_token(token)
        
        if not payload:
            return JsonResponse({'error': 'Invalid or expired token'}, status=401)
        
        # Add user info to request
        request.user_id = payload['user_id']
        request.user_email = payload['email']
        
        return self.get_response(request)