from rest_framework import viewsets, permissions, decorators, response, parsers, status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer

@api_view(['GET'])
@authentication_classes([])           # bypass DRF authentication backends
@permission_classes([AllowAny])       # allow anonymous access
def public_inspector_count(request):
    """Return total number of projects (public endpoint)."""
    total = User.objects.filter(created_by="inspector").count()
    return Response({'total': total})

@api_view(['GET'])
@authentication_classes([])           # bypass DRF authentication backends
@permission_classes([AllowAny])       # allow anonymous access
def public_inspector(request):
    """Return total number of projects (public endpoint)."""
    inspector = User.objects.filter(account_type="inspector").all()
    inspectorserializer=UserSerializer(inspector, many=True, context={'request': request})
    return Response({'inspectors': inspectorserializer.data})

@api_view(['GET'])
@authentication_classes([])           # bypass DRF authentication backends
@permission_classes([AllowAny])       # allow anonymous access
def public_contractor(request):
    """Return total number of projects (public endpoint)."""
    contractor = User.objects.filter(account_type="contractor").all()
    contractorserializer=UserSerializer(contractor, many=True, context={'request': request})
    return Response({'contractors': contractorserializer.data})

