import os
from pymongo import MongoClient
from bson import ObjectId
os.environ["MONGODB_URI"]="mongodb://localhost:27017/"
def get_mongo_client():
    """Create and return a MongoDB client"""

    print(os.getenv('MONGODB_URI'))
    mongodb_uri = os.getenv('MONGODB_URI')
    if not mongodb_uri:
        raise ValueError("MONGODB_URI environment variable is not set")
    
    return MongoClient(mongodb_uri)

def get_mongo_db():
    """Get the MongoDB database instance"""
    client = get_mongo_client()
    db_name = os.getenv('MONGODB_DB_NAME', 'mydatabase')
    return client[db_name]

def get_users_collection():
    """Get the users collection"""
    db = get_mongo_db()
    return db['users']