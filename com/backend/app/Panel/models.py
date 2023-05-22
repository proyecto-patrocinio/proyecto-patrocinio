from django.db import models
from Board.models import Board

# Create your models here.

class Panel(models.Model):
    title = models.CharField(max_length=255, null=False)
    id = models.IntegerField(null=False, primary_key=True, auto_created=True)
    board = models.ForeignKey(Board,
                              on_delete=models.CASCADE,
                              related_name="panels",
                              verbose_name='Board',
                              null=False
                              )
    def __str__(self):
        return f'{self.title}_{self.board}'
