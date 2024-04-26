from django.db import models

class Board(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=45, null=False, unique=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Pizarra"
        verbose_name_plural = "Pizarras"