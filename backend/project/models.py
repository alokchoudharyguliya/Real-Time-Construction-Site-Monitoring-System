from django.db import models


class Project(models.Model):
	STATUS_CHOICES = [
		('on_track', 'On Track'),
		('delayed', 'Delayed'),
		('completed', 'Completed'),
		('on_hold', 'On Hold'),
	]

	name = models.CharField(max_length=255)
	contractor = models.CharField(max_length=255, blank=True)
	location = models.CharField(max_length=255, blank=True)
	progress = models.PositiveSmallIntegerField(default=0)
	status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='on_track')
	budget = models.CharField(max_length=64, blank=True)
	recent_image=models.ImageField(blank=True)
	deadline = models.DateField(null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self) -> str:
		return f"{self.name} ({self.location})"

	class Meta:
		ordering = ['-created_at']
