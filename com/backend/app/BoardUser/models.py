from django.db import models
from django.contrib.auth.models import User
from Board.models import Board

class BoardUser(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name='User',
        related_name="boardusers",
        null=False,
    )

    board = models.ForeignKey(
        Board,
        on_delete=models.CASCADE,
        verbose_name='Board',
        related_name="boardusers",
        null=False,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'{self.user}/{self.board}'

    class Meta:
        unique_together = ('user', 'board')
        verbose_name_plural = "Board Users"