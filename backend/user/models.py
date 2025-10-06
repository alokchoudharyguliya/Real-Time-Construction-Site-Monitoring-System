from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Add your extra fields
    licenseNo = models.CharField(max_length=15, blank=True)
    name = models.CharField(max_length=150, blank=True)
    account_type = models.CharField(
        max_length=20,
        choices=[("admin", "Admin"), ("inspector", "Inspector"), ("contractor", "Contractor")]
    )

    def __str__(self):
        return self.username
