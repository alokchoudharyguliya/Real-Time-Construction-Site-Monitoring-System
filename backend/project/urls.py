from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet
from django.urls import path, include
from .public_views import public_project_count, public_project_list
router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
# urlpatterns = router.urls
# Exposes:
# GET /api/projects/ -> list
# POST /api/projects/ -> create
# GET /api/projects/{id}/ -> retrieve
# PUT/PATCH /api/projects/{id}/ -> update
# DELETE /api/projects/{id}/ -> destroy

# put explicit public endpoints BEFORE the router so they match first
urlpatterns = [
    path('projects/public-count/', public_project_count, name='public-project-count'),
    path('projects/public-list/', public_project_list, name='public-project-list'),
    path('', include(router.urls)),
]