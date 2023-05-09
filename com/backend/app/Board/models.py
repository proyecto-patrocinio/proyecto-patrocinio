from django.db import models

# Create your models here.
class Board(models.Model):
    title = models.CharField(max_length=45, null=False, unique=True)
    id = models.AutoField(primary_key=True)
    is_consultancy = models.BooleanField(null=False)

    def __str__(self):
        return self.title
