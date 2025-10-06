from rest_framework import serializers
from .models import Project
from report.serializers import ReportSerializer


class ProjectSerializer(serializers.ModelSerializer):
    reports = ReportSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'contractor', 'location', 'progress', 'status', 'budget', 'deadline', 'reports', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
