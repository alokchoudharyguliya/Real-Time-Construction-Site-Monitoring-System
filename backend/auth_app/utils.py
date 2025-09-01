import jwt
import bcrypt
from datetime import datetime, timedelta
from django.conf import settings
import os
from pymongo import MongoClient
from bson import ObjectId
import json
from bson.json_util import dumps

# MongoDB connection
def get_mongo_db():
    mongodb_uri = os.getenv('MONGODB_URI')
    db_name = os.getenv('MONGODB_DB_NAME', 'mydatabase')
    client = MongoClient(mongodb_uri)
    return client[db_name]

def get_users_collection():
    db = get_mongo_db()
    return db['users']

# Password hashing
def hash_password(password):
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# JWT Token functions
def generate_jwt_token(user_id, email):
    payload = {
        'user_id': str(user_id),
        'email': email,
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow()
    }
    
    secret_key = os.getenv('SECRET_KEY', 'fallback-secret-key')
    token = jwt.encode(payload, secret_key, algorithm='HS256')
    return token

def verify_jwt_token(token):
    try:
        secret_key = os.getenv('SECRET_KEY', 'fallback-secret-key')
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# JSON encoder for MongoDB ObjectId
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)