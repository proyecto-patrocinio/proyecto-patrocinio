from django.db import models
from Consultation.models import Consultation
from django.contrib.auth.models import User


class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    time_stamp = models.DateTimeField(auto_now_add=True)
    text = models.TextField(blank=False)
    consultation = models.ForeignKey(
        Consultation,
        on_delete=models.CASCADE,
        related_name="comment",
        verbose_name="consultation",
        null=False
    )
    user = models.ForeignKey(
        User,
        on_delete=models.DO_NOTHING,
        related_name="comment",
        verbose_name="user",
        null=False
    )

    def __str__(self):
        return f'{self.consultation}_{self.id}'

    class Meta:
        verbose_name_plural = "Comentarios"
        verbose_name = "Comentario"


class File(models.Model):
    id = models.AutoField(primary_key=True)
    time_stamp = models.DateTimeField(auto_now_add=True)
    comment = models.ForeignKey(
        Comment,
        on_delete=models.CASCADE,
        related_name="files",
        verbose_name="comment",
        null=False
    )
    filename = models.CharField(max_length=255, blank=False)

    def __str__(self):
        return f'{self.comment}_{self.time_stamp}'

    class Meta:
        verbose_name_plural = "Archivos"
        verbose_name = "Archivo"
