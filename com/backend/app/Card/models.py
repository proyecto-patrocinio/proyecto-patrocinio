from django.db import models

# Create your models here.
class Card(models.Model):
  consultation = models.CharField(max_length=256, null=False)
  tag = models.CharField(max_length=256, null=False)
  panel = models.CharField(max_length=256, null=False)
  #panel = models.ForeignKey(Panel, null=False, on_delete=models.CASCADE)
  
  def __str__(self):
    return self.consultation

  class Meta:
    ordering = ['tag']

    
    
    