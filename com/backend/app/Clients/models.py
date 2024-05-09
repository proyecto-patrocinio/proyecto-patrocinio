from django.db import models
from locality.models import Locality
from .choices import *


class Person(models.Model):
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=150, verbose_name='Nombre')
    last_name = models.CharField(max_length=150, verbose_name='Apellido')
    id_type= models.CharField(choices=id_type, max_length=10, verbose_name='Tipo de documento')
    id_value = models.CharField(unique=True, max_length=20, blank=False, null=False, verbose_name='Num. de documento')
    locality = models.ForeignKey(Locality, on_delete=models.DO_NOTHING)
    sex = models.CharField(choices=sex, max_length=6, default='FEMALE', verbose_name='Sexo')
    birth_date = models.DateField(verbose_name='Nacimiento')
    address = models.TextField(max_length=100, verbose_name='Dirección')

    class Meta:
        abstract = True

class Client(Person):
    postal = models.IntegerField(verbose_name='Código postal')
    marital_status = models.CharField(choices=marital_status, max_length=10, verbose_name='Estado civil',)
    housing_type = models.CharField(choices=housing_type, max_length=20, verbose_name='Vivienda')
    studies = models.CharField(choices=studies, max_length=30, verbose_name='Estudios')
    email = models.EmailField(unique=True, verbose_name='Email')
    employment = models.CharField(max_length=45, verbose_name='Empleo', default="Desempleado")
    salary = models.IntegerField(verbose_name='Salario', default=0)
    other_income = models.CharField(max_length=45, verbose_name='Otros Ingresos', default="No posee")
    amount_other_income = models.IntegerField(verbose_name='Ingreso por otros ingresos', default=0)
    amount_retirement = models.IntegerField(verbose_name='Ingreso por jubilación', default=0)
    amount_pension = models.IntegerField(verbose_name='Ingreso por pensión', default=0)
    vehicle = models.CharField(max_length=300, verbose_name='Vehículo', default="No posee")
    partner_salary = models.IntegerField(default=0)

    def __str__(self) -> str:
        return f'{self.last_name} {self.first_name}'

    class Meta:
        verbose_name_plural = "Consultantes"
        verbose_name = "Consultante"



class Child(Person):
    id_value = models.CharField( blank=False, null=False, max_length=20, verbose_name='Num. de documento')
    client_user = models.ForeignKey(Client, null=False, on_delete=models.CASCADE, verbose_name="familia", related_name="children")

    def __str__(self) -> str:
        return f"{self.first_name}_{self.last_name}"

    class Meta:
        verbose_name_plural = "Hijos"
        verbose_name = "Hijo"

class Tel(models.Model):
    id = models.AutoField( primary_key=True)
    phone_number = models.CharField(max_length=20, verbose_name='Número de teléfono')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="tels" )

    def __str__(self) -> str:
        return f'{self.phone_number}'

    class Meta:
        verbose_name_plural = "Teléfonos"
        verbose_name = "Teléfono"
