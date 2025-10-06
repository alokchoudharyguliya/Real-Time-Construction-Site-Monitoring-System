from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Project
from .serializers import ProjectSerializer

@api_view(['GET'])
@authentication_classes([])           # bypass DRF authentication backends
@permission_classes([AllowAny])       # allow anonymous access
def public_project_count(request):
    """Return total number of projects (public endpoint)."""
    total = Project.objects.count()
    return Response({'total': total})

@api_view(['GET'])
@authentication_classes([])           # bypass DRF authentication backends
@permission_classes([AllowAny])       # allow anonymous access
def public_project_list(request):
    """Return a small public list of projects (no auth)."""
    qs = Project.objects.all()[:50]  # limit for safety
    serializer = ProjectSerializer(qs, many=True, context={'request': request})
    return Response(serializer.data)