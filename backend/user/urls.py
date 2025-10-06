from rest_framework.routers import DefaultRouter
from .views import UserViewSet
from public_views import public_inspector_count
from django.urls import path,include
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

# urlpatterns = router.urls

# Exposes:
# GET /api/users/ -> list
# POST /api/users/ -> create
# GET /api/users/{id}/ -> retrieve
# GET /api/users/{id}/idcard/ -> custom action to generate PDF idcard

urlpatterns = [
    path('users/public-inspector-count/', public_inspector_count, name='public-inspector-count'),
    path('', include(router.urls)),
]