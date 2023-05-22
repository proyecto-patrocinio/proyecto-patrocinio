'''
    Models is a python file that contains the definition of the database tables
'''
from django.db import models

class Nationality(models.Model):
    id = models.IntegerField( primary_key=True, auto_created=True)
    name = models.CharField( max_length=100, verbose_name='Nacionalidad')

    def __str__(self) -> str:
        return f'{self.name}'

class Province(models.Model):
    id = models.IntegerField( primary_key=True, auto_created=True)
    name = models.CharField( max_length=100, verbose_name='Provincia' )
    nationality = models.ForeignKey (Nationality, 
                                     on_delete=models.CASCADE,
                                     related_name="provinces",
                                     verbose_name='Nacionalidad'
                                    )
    def __str__(self) -> str:
        return f'{self.name}'

class Locality(models.Model):
    id = models.IntegerField( primary_key=True, auto_created=True)
    name = models.CharField( max_length=100, verbose_name='Localidad' )
    province = models.ForeignKey(Province,
                                    related_name='localities',
                                    on_delete=models.CASCADE, 
                                    verbose_name='Provincia')

    def __str__(self) -> str:
        return f'{self.name}'
