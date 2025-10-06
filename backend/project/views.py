from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    """API for Projects: list, retrieve, create, update, delete.

    Added a small `count` action (GET /projects/count/) that returns the total
    number of projects as a raw JSON number. The count uses the viewset's
    queryset and any filters applied by DRF so it respects the same scoping.
    """

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        request_user=getattr(self.request,"user",None)
        if request_user is None or not request_user.is_authenticated:
            return Project.objects.none()
        if getattr(request_user,"account_type",None)=="inspector" or getattr(request_user,"is_superuser",False):
            return Project.objects.all()
        
        return Project.objects.filter(contractor=self.request.user)
    def perform_create(self, serializer):
        # No owner field on Project for now; if needed attach user here.
        serializer.save()

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def count(self, request, *args, **kwargs):
        """Return the number of projects as a JSON object.

        Example response: { "total": 42 }
        """
        qs = self.filter_queryset(self.get_queryset())
        total = qs.count()
        return Response({"total": total})

# @api_view(['GET'])
# @authentication_classes([])           # bypass DRF authentication backends
# @permission_classes([AllowAny])       # allow anonymous access
# def public_project_list(request):
#     """Return a small public list of projects (no auth)."""
#     qs = Project.objects.all()[:50]  # limit for safety
#     serializer = ProjectSerializer(qs, many=True, context={'request': request})
#     return Response(serializer.data)