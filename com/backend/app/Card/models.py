from django.db import models
from Panel.models import Panel

# Create your models here.
class Card(models.Model):
  consultation = models.CharField(max_length=256)
  tag = models.CharField(max_length=256)
  #panel = models.CharField(max_length=256)
  panel = models.ForeignKey(Panel, null=False, on_delete=models.CASCADE)
  
  def __str__(self):
    return self.consultation

  class Meta:
    ordering = ['tag']

    
    
    