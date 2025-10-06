from rest_framework import viewsets, permissions, decorators, response, parsers, status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import User

@api_view(['GET'])
@authentication_classes([])           # bypass DRF authentication backends
@permission_classes([AllowAny])       # allow anonymous access
def public_contractor_count(request):
    """Return total number of projects (public endpoint)."""
    total = User.objects.filter(created_by="contractor").count()
    return Response({'total': total})

@api_view(['GET'])
@authentication_classes([])           # bypass DRF authentication backends
@permission_classes([AllowAny])       # allow anonymous access
def public_inspector_count(request):
    """Return total number of projects (public endpoint)."""
    total = User.objects.filter(created_by="inspector").count()
    return Response({'total': total})
