from datetime import datetime
import random
from django.db import models
from django.forms import ValidationError
from django.urls import reverse
from Consultation.choices import PROGRESS_STATES , AVAILABILITY_STATES, REQUEST_STATES
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

    id = models.AutoField(primary_key=True)
    consultation = models.ForeignKey(
        Consultation,
        verbose_name="Consulta",
        related_name="request_consultations",
        on_delete=models.CASCADE,
        null=False,
    )
    destiny_board = models.ForeignKey(
        Board,
        null=False,
        verbose_name="Tablero de destino",
        related_name="request_consultations",
        on_delete=models.CASCADE,
    )
    state = models.CharField(
        max_length=12, choices=REQUEST_STATES,
        default="PENDING",
        verbose_name="Estado de solicitud"
    )
    resolution_timestamp = models.DateTimeField(
        verbose_name="Tiempo de resolución",
        null=True, # Empty only when in the PENDING state.
        blank=True,
        editable=True
    )

    def save(self, *args, **kwargs):
        if self.state != "PENDING":
            self.resolution_timestamp = datetime.now()
        else:
            self.resolution_timestamp = None
        super().save(*args, **kwargs)


    def clean(self):
        self.clean_fields()

        if self.state == 'PENDING':
            existing_pending_request = RequestConsultation.objects.filter(consultation=self.consultation, state='PENDING').exclude(pk=self.pk).first()
            if existing_pending_request:
                raise ValidationError('Ya existe una solicitud pendiente para esta consulta.')

    class Meta:
        verbose_name = ("Solicitud de consulta")
        verbose_name_plural = ("Solicitudes de consultas")
        unique_together = ('consultation', 'state', 'resolution_timestamp')  # In the 'PENDING' state, the request for consultation must be unique.

    def __str__(self):
        return f'{self.id}/{self.consultation}/{self.state}/{self.resolution_timestamp}'.replace(" ", "_")

    def get_absolute_url(self):
        return reverse("RequestConsultation_detail", kwargs={"pk": self.id})
