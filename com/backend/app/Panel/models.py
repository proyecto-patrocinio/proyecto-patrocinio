from django.db import models
from Board.models import Board

# Create your models here.

class Panel(models.Model):
    title = models.CharField(max_length=255, null=False)
    id = models.IntegerField(null=False, primary_key=True)
    board = models.ForeignKey(Board,
                              on_delete=models.CASCADE,# on_delete attribute specifies the behavior to adopt when the referenced object is deleted.
                              related_name="panels",# related_name attribute specifies the name of the reverse relation  
                              verbose_name='Board',# from the User model back to this model.       
                              null=False)
    def __str__(self):
        return self.title