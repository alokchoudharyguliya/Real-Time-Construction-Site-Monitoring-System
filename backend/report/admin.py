from django.contrib import admin

from .models import Report


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
	list_display = ('title', 'type', 'date', 'status', 'size', 'created_by', 'created_at')
	readonly_fields = ('created_at',)
	search_fields = ('title', 'type')
# Register your models here.
