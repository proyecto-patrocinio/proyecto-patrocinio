from django.db import models
from Card.models import Card

class Calendar(models.Model):
    id = models.AutoField(primary_key=True)
    card = models.OneToOneField(
        Card,
        verbose_name="Tarjeta",
        on_delete=models.CASCADE,
        null=False,
        unique=True
    )
    class Meta:
        verbose_name_plural = "Calendarios"
        verbose_name = "Calendario"

class Event(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=45, null=False)
    description = models.TextField(blank=True, null=True)
    start =  models.DateTimeField(null=False, blank=False)
    end =  models.DateTimeField(null=False, blank=False)
    calendar = models.ForeignKey(
        Calendar,
        related_name="events",
        null=False,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Eventos"
        verbose_name = "Evento"
