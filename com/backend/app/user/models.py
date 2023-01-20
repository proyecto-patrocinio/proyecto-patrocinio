'''
    Models is a python file that contains the definition of the database tables
'''
from django.db import models
from django.contrib.auth.models import User

 

class User(models.Model): 
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    description = models.TextField( null=True, blank=True)

