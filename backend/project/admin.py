from django.contrib import admin
from .models import Project
# Register your models here.
@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
	list_display = ('name', 'contractor', 'location', 'progress', 'budget', 'recent_image','deadline','updated_at','created_by', 'created_at')
	readonly_fields = ('created_at',)
	search_fields = ('name', 'contractor')