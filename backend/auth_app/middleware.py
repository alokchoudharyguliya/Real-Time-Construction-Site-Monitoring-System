##############CUSTOM MIDDLEWARE###########################
# NOT IS USE CURRENTLY SWITCHED TO DRF'S AUTHENTICATION
# from django.http import JsonResponse
# from .utils import verify_jwt_token

# class JWTAuthenticationMiddleware:
#     def __init__(self, get_response):
#         self.get_response = get_response

#     def __call__(self, request):
#         # Skip authentication for these paths
#         if request.path in ['/api/projects/','/api/auth/signup/', '/api/auth/login/','/api/reports/public-count/','/video/video_feed/','/api/reports/public-count/']:
#             return self.get_response(request)
#         if request.path.rstrip('/') in ['/api/auth/signup', '/api/auth/login', '/video/video_feed']:
#             return self.get_response(request)
        
#          # centralize whitelist for paths that must be publicly accessible
#         PUBLIC_PATHS = {
#             '/api/projects/',
#             '/api/auth/signup/',
#             '/api/auth/login/',
#             '/api/reports/public-count/',
#             '/api/reports/count/',            # add if you want this public
#             '/video/video_feed/',
#         }
#         if request.path in PUBLIC_PATHS or request.path.rstrip('/') in {p.rstrip('/') for p in PUBLIC_PATHS}:
#             return self.get_response(request)

#         # Check for token in Authorization header
#         auth_header = request.headers.get('Authorization')
        
#         if not auth_header or not auth_header.startswith('Bearer '):
#             return JsonResponse({'error': 'Authentication credentials not provided'}, status=401)
#         token = auth_header.split(' ')[1]
#         print(token)
#         payload = verify_jwt_token(token)
        
#         if not payload:
#             return JsonResponse({'error': 'Invalid or expired token'}, status=401)
#         print(token)
#         print(auth_header)
#         # Add user info to request
#         request.user_id = payload['user_id']
#         request.user_email = payload['email']
#         print(request.user_id)
#         print(request.user_email)
#         return self.get_response(request)