from django.db import models
from locality.models import Locality
from .choices import *


class Person(models.Model):
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=150, verbose_name='First Name')
    last_name = models.CharField(max_length=150, verbose_name='Last Name')
    id_type= models.CharField(choices=id_type, max_length=10, verbose_name='Type of identification document')
    id_value = models.CharField(unique=True, max_length=20, blank=False, null=False, verbose_name='Document value')
    locality = models.ForeignKey(Locality, on_delete=models.DO_NOTHING)
    sex = models.CharField(choices=sex, max_length=6, default='FEMALE', verbose_name='Sex')
    birth_date = models.DateField(verbose_name='Birthdate')
    address = models.TextField(max_length=100, verbose_name='Address')

    class Meta:
        abstract = True

class Client(Person):
    postal = models.IntegerField(verbose_name='Postal Code')
    marital_status = models.CharField(choices=marital_status, max_length=10, verbose_name='Civil status',)
    housing_type = models.CharField(choices=housing_type, max_length=20, verbose_name='Housing Type')
    studies = models.CharField(choices=studies, max_length=30, verbose_name='Education level')
    email = models.EmailField(unique=True, verbose_name='Email address')

    def __str__(self) -> str:
        return f'{self.last_name} {self.first_name}'

class Patrimony(models.Model):
    id = models.OneToOneField(Client, on_delete=models.CASCADE, related_name="patrimony", primary_key=True)
    employment = models.CharField(max_length=45, verbose_name='Employment')
    salary = models.IntegerField(verbose_name='Salary', default=0)
    other_income = models.CharField(max_length=45, verbose_name='Otros Ingresos')
    amount_other_income = models.IntegerField(verbose_name='Amount Other Income', default=0)
    amount_retirement = models.IntegerField(verbose_name='Retirement Amount', default=0)
    amount_pension = models.IntegerField(verbose_name='Pension Amount', default=0)
    vehicle = models.CharField(max_length=300, verbose_name='Vehicle')

    def __str__(self) -> str:
        return f'{self.client}_{self.employment}'.replace(" ","-")

    class Meta:
        verbose_name_plural = "Patrimonies"


class Family(models.Model):
    id = models.OneToOneField( Client, on_delete=models.CASCADE, related_name="family", primary_key=True)
    partner_salary = models.IntegerField()

    def __str__(self) -> str:
        return f'{self.partner_salary}'

    class Meta:
        verbose_name_plural = "Families"


class Child(Person):
    id_value = models.CharField( blank=False, null=False, max_length=20, verbose_name='Document value')
    family_client_user = models.ForeignKey(Family, on_delete=models.CASCADE, verbose_name="family", related_name="children")

    def __str__(self) -> str:
        return f'{ self.family_client_user + "/"  + self.name + "_" + self.last_name}'

    class Meta:
        verbose_name_plural = "Children"


class Tel(models.Model):
    id = models.AutoField( primary_key=True)
    phone_number = models.CharField(max_length=20, verbose_name='Phone number')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="tels" )

    def __str__(self) -> str:
        return f'{self.phone_number}'
