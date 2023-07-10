from django.db import models
from Consultation.choices import CONSULTATION_STATES
from Clients.models import Client

class Consultation(models.Model):
    id = models.AutoField(primary_key=True)
    state = models.CharField(max_length=12, choices=CONSULTATION_STATES, default='PENDING', verbose_name="Estado")
    time_stamp = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)
    client = models.ForeignKey( Client,
                                on_delete=models.DO_NOTHING,# on_delete attribute specifies the behavior to adopt when the referenced object is deleted.
                                related_name="consultations",# related_name attribute specifies the name of the reverse relation.
                                verbose_name='Client',# from the User model back to this model.
                                null=False
                                )
    opponent =  models.CharField(max_length=500)

    def __str__(self):
        return f'{self.client}_{self.id}'
