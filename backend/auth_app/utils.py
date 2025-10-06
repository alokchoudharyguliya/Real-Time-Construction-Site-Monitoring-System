import jwt
from datetime import datetime, timedelta
from django.conf import settings
import json


# JWT Token functions
def generate_jwt_token(user_id, email):
    payload = {
        'user_id': str(user_id),
        'email': email,
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow()
    }
    secret_key = getattr(settings, 'SECRET_KEY', 'fallback-secret-key')
    token = jwt.encode(payload, secret_key, algorithm='HS256')
    # In PyJWT >=2.0 encode returns a str
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    return token


def verify_jwt_token(token):
    try:
        secret_key = getattr(settings, 'SECRET_KEY', 'fallback-secret-key')
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        try:
            return super().default(o)
        except Exception:
            return str(o)