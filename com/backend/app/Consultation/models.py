from django.db import models
from Consultation.choices import CONSULTATION_STATES
from Clients.models import Client
from Board.models import Board


class Consultation(models.Model):
    id = models.AutoField(primary_key=True)
    state = models.CharField(
        max_length=12, choices=CONSULTATION_STATES,
        default="REGISTERED",
        verbose_name="Estado"
    )
    time_stamp = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)
    client = models.ForeignKey(
        Client,
        on_delete=models.DO_NOTHING,  # on_delete attribute specifies the behavior to adopt when the referenced object is deleted.
        related_name="consultations",  # related_name attribute specifies the name of the reverse relation.
        verbose_name="Cliente",  # from the User model back to this model.
        null=False
    )
    opponent = models.CharField(max_length=500)

    def __str__(self):
        return f'{self.client}/{self.id}'.replace(" ", "_")


class RequestConsultation(models.Model):

    id = models.AutoField(primary_key=True)
    consultation = models.OneToOneField(
        Consultation,
        verbose_name="Consulta",
        related_name="request_consultations",
        on_delete=models.CASCADE,
        null=False,
    )
    destiny_board = models.ForeignKey(
        Board,
        null=False,
        on_delete=models.CASCADE,
    )

    class Meta:
        verbose_name = ("RequestConsultation")
        verbose_name_plural = ("RequestConsultations")

    def __str__(self):
        return f'req_consultation/{self.consultation}'.replace(" ", "_")

    def get_absolute_url(self):
        return reverse("RequestConsultation_detail", kwargs={"pk": self.id})
