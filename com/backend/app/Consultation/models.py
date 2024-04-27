from django.db import models
from django.urls import reverse
from Consultation.choices import PROGRESS_STATES , AVAILABILITY_STATES
from Clients.models import Client
from Board.models import Board

class Consultation(models.Model):
    id = models.AutoField(primary_key=True)
    availability_state = models.CharField(
        max_length=12, choices=AVAILABILITY_STATES,
        default="CREATED",
        verbose_name="Estado de disponibilidad"
    )
    progress_state = models.CharField(
        max_length=12, choices=PROGRESS_STATES,
        default="TODO",
        verbose_name="Estado de progreso"
    )
    time_stamp = models.DateTimeField(auto_now_add=True)
    start_time = models.DateTimeField(null=True, blank=True)
    description = models.TextField(blank=True)
    client = models.ForeignKey(
        Client,
        on_delete=models.DO_NOTHING,  # on_delete attribute specifies the behavior to adopt when the referenced object is deleted.
        related_name="consultations",  # related_name attribute specifies the name of the reverse relation.
        verbose_name="Consultante",
        null=False
    )
    opponent = models.CharField(max_length=500)
    tag = models.CharField(max_length=30)

    def __str__(self):
        return f'{self.client}/{self.id}/{self.tag}'.replace(" ", "_")

    class Meta:
        verbose_name_plural = "Consultas"
        verbose_name = "Consulta"


class RequestConsultation(models.Model):

    consultation = models.OneToOneField(
        Consultation,
        verbose_name="Consulta",
        related_name="request_consultations",
        on_delete=models.CASCADE,
        null=False,
        primary_key=True
    )
    destiny_board = models.ForeignKey(
        Board,
        null=False,
        verbose_name="Tablero de destino",
        related_name="request_consultations",
        on_delete=models.CASCADE,
    )

    class Meta:
        verbose_name = ("Solicitud de consulta")
        verbose_name_plural = ("Solicitudes de consultas")

    def __str__(self):
        return f'req_consultation/{self.consultation}'.replace(" ", "_")

    def get_absolute_url(self):
        return reverse("RequestConsultation_detail", kwargs={"pk": self.id})
