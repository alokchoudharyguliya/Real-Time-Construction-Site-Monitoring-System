from rest_framework import serializers
from .models import Report


class ReportSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Report
        fields = ['id', 'title', 'type', 'date', 'status', 'file', 'file_url', 'size', 'created_by', 'created_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'file_url']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file:
            try:
                url = obj.file.url
                if request is not None:
                    return request.build_absolute_uri(url)
                return url
            except Exception:
                return None
        return None

    def create(self, validated_data):
        # allow automatic size calculation when file is uploaded
        file = validated_data.get('file')
        if file and not validated_data.get('size'):
            size_mb = file.size / (1024 * 1024)
            validated_data['size'] = f"{size_mb:.1f} MB" if size_mb >= 1 else f"{int(file.size / 1024)} KB"
        return super().create(validated_data)
