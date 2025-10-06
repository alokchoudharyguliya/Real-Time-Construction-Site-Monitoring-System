from django.db import models
from django.conf import settings


# A simple Report model to hold uploaded report files and metadata.
# This is intentionally minimal for MVP. You can extend with relations,
# permissions, or a storage backend (S3) later.
class Report(models.Model):
	REPORT_TYPES = [
		('progress', 'Progress'),
		('safety', 'Safety'),
		('quality', 'Quality'),
	]

	STATUS_CHOICES = [
		('completed', 'Completed'),
		('pending', 'Pending'),
	]

	title = models.CharField(max_length=255)
	type = models.CharField(max_length=32, choices=REPORT_TYPES, default='progress')
	date = models.DateField()
	status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='completed')
	file = models.FileField(upload_to='reports/')
	size = models.CharField(max_length=64, blank=True)
	# Optional link to a Project. Nullable to keep existing behaviour for reports
	# that are not associated with a project.
	project = models.ForeignKey('project.Project', null=True, blank=True, on_delete=models.SET_NULL, related_name='reports')
	created_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.title} ({self.date})"

	class Meta:
		ordering = ['-created_at']
