from django.db import models
from Panel.models import Panel
from Consultation.models import Consultation

# Create your models here.
class Card(models.Model):
  consultation = models.OneToOneField( Consultation,
                                      on_delete= models.CASCADE,
                                      related_name="cards",
                                      verbose_name="Consultation",
                                      )
  tag = models.CharField(max_length=256)
  panel = models.ForeignKey(Panel,
                            null=False,
                            on_delete=models.CASCADE,# on_delete attribute specifies the behavior to adopt when the referenced object is deleted.
                            related_name="cards",# related_name attribute specifies the name of the reverse relation  
                            verbose_name='Panel',# from the User model back to this model.       
                            )

  def __str__(self):
    return self.tag

  class Meta:
    ordering = ['tag']
