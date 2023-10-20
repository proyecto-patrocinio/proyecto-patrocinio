from django.db import models
from Board.models import Board


class Panel(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, null=False)
    board = models.ForeignKey(
        Board,
        on_delete=models.CASCADE,
        related_name="panels",
        verbose_name='Board',
        null=False
    )
    def __str__(self):
        return f'{self.title}_{self.board}'
