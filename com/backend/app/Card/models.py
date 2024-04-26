from django.db import models
from Panel.models import Panel
from Consultation.models import Consultation

class Card(models.Model):
    consultation = models.OneToOneField(
      Consultation,
      on_delete=models.CASCADE,
      related_name="card",
      verbose_name="Consultation",
      primary_key=True,
    )
    tag = models.CharField(max_length=256)
    panel = models.ForeignKey(
      Panel,
      null=False,
      on_delete=models.CASCADE,
      related_name="cards",
      verbose_name='Panel',
    )

    def __str__(self):
        return self.tag

    class Meta:
        ordering = ['tag']
        verbose_name_plural = "Tarjetas"
        verbose_name = "Tarjetas"
