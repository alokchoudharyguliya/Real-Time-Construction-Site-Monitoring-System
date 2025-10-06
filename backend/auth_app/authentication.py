from rest_framework import authentication, exceptions
from django.contrib.auth import get_user_model
from .utils import verify_jwt_token

User = get_user_model()


class JWTAuthentication(authentication.BaseAuthentication):
    """Authenticate requests using a Bearer JWT in the Authorization header.

    Returns a `(user, token)` tuple or `None` if no token was provided. Raises
    `AuthenticationFailed` when the token is invalid.
    """

    def authenticate(self, request):
        auth = request.headers.get('Authorization') or request.META.get('HTTP_AUTHORIZATION')
        if not auth:
            return None
        if not auth.startswith('Bearer '):
            return None

        token = auth.split(' ', 1)[1]
        payload = verify_jwt_token(token)
        if not payload:
            raise exceptions.AuthenticationFailed('Invalid or expired token')

        user_id = payload.get('user_id')
        if not user_id:
            raise exceptions.AuthenticationFailed('Invalid token payload')

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed('User not found')

        return (user, token)
