from rest_framework import viewsets, permissions, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from .models import Report
from .serializers import ReportSerializer


class ReportViewSet(viewsets.ModelViewSet):
		"""
		Basic Report API: list, retrieve, create, update, destroy.

		Notes / references:
		- For file uploads via DRF see: https://www.django-rest-framework.org/api-guide/parsers/#multipartparser
		- To persist files in S3 use django-storages and configure DEFAULT_FILE_STORAGE.
		- Add authentication/permissions as appropriate (IsAuthenticated / custom rules).
		"""
		queryset = Report.objects.all()
		serializer_class = ReportSerializer
		permission_classes = [permissions.IsAuthenticated]
		parser_classes = [parsers.MultiPartParser, parsers.FormParser]
		def get_queryset(self):
			"""
			Return reports according to the requesting user's account_type:
			- If user is an inspector (or superuser) return all reports.
			- Otherwise return only reports created by the requesting user.
			- If user is unauthenticated, return an empty queryset (permissions will usually block access).
			"""
			request_user = getattr(self.request, "user", None)
			if request_user is None or not request_user.is_authenticated:
				# permission_classes = IsAuthenticated will normally prevent unauthenticated access,
				# but returning an empty queryset is safer if this method is called elsewhere.
				return Report.objects.none()

			# Allow inspectors (and superusers) to see all reports
			if getattr(request_user, "account_type", None) == "inspector" or getattr(request_user, "is_superuser", False):
				return Report.objects.all()

			# Otherwise, restrict to reports created by this user (contractor)
			return Report.objects.filter(created_by=request_user)

		def perform_create(self, serializer):
			# attach the current user as the creator
			serializer.save(created_by=self.request.user)

		@action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
		def download(self, request, pk=None):
			# Optional convenience endpoint that can return a signed URL or stream.
			report = self.get_object()
			return Response({'url': report.file.url})
		
		# @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
		@action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
		def count(self, request):
				"""
				Return the number of reports accessible to the requester.
				Uses get_queryset() so inspectors/superusers get the full count,
				others get their own reports count.
				"""
				total = Report.objects.count()
				# total = self.get_queryset().count()
				return Response({'count': total})
				
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@api_view(['GET'])
@authentication_classes([])           # <- do not run any DRF authentication backends
@permission_classes([AllowAny])       # <- allow anonymous access
def public_report_count(request):
    total = Report.objects.count()
    return Response({'count': total})
