from django.db import models

# Create your models here.

class User(models.Model):
    id = models.BigAutoField(primary_key=True)
    username = models.CharField(max_length=20,verbose_name='usuario')
    password = models.CharField(max_length=20,verbose_name='contraseña')
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    email = models.EmailField(max_length=50, verbose_name='correo electrónico')
    date_joined = models.DateField(verbose_name='Fecha de inicio')
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)