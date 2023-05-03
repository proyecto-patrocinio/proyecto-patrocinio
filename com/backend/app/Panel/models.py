from django.db import models
from Board.models import Board

# Create your models here.

class Panel(models.Model):
    title = models.CharField(max_length=255, null=False)
    id = models.IntegerField(null=False, primary_key=True)
    board = models.ForeignKey(Board, on_delete=models.CASCADE, null=False)
    #board = models.CharField(max_length=45, null=False)