from django.db import models

# This is a placeholder model for Django admin
class User(models.Model):
    class AccountType(models.TextChoices):
        CONTRACTOR = 'contractor', 'Contractor'
        INSPECTOR = 'inspector', 'Inspector'
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    age = models.IntegerField()
    imageUrl = models.URLField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    organization = models.CharField(max_length=255, blank=True, null=True)
    account_type = models.CharField(
        max_length=20,
        choices=AccountType.choices,
        default=AccountType.CONTRACTOR
    )
    permissions = models.JSONField(default=list, blank=True)  # Array of strings

    class Meta:
        app_label = 'users'
    
    def __str__(self):
        return self.name