from rest_framework.routers import DefaultRouter
from .views import ReportViewSet
from report.views import public_report_count
from django.urls import path,include
router = DefaultRouter()
router.register(r'reports', ReportViewSet, basename='report')


public_url=path('/reports/public-count/', public_report_count)
# urlpatterns = list(router.urls) + [public_url]
urlpatterns = [
    # Ensure custom public path comes BEFORE the router so it is matched first
    path('reports/public-count/', public_report_count),     # public endpoint (no auth)
    path('', include(router.urls)),                         # router (reports/, reports/{pk}/, etc.)
]
# urlpatterns = router.urls,
# This exposes endpoints:
# GET /api/reports/         -> list
# POST /api/reports/        -> create (multipart/form-data)
# GET /api/reports/{id}/    -> retrieve
# GET /api/reports/{id}/download/ -> convenience action returning file url
