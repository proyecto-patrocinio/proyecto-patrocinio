from django.db import models
from locality.models import Locality
from .choices import *

class Client(models.Model):
    id = models.AutoField(primary_key=True)
    postal = models.IntegerField(verbose_name='Postal Code')
    address = models.TextField(max_length=100, verbose_name='Address')
    marital_status = models.CharField(choices=marital_status, max_length=10, verbose_name='Civil status',)
    housing_type = models.CharField(choices=housing_type, max_length=20, verbose_name='Housing Type')
    studies = models.CharField(choices=studies, max_length=30, verbose_name='Education level')
    locality = models.ForeignKey(Locality, on_delete=models.CASCADE)
    email = models.EmailField(unique=True, verbose_name='Email address')
    id_type= models.CharField(choices=id_type, max_length=10, verbose_name='Type of identification document')
    id_value = models.CharField(default='', unique=True, max_length=20, verbose_name='Document value')
    first_name = models.CharField(max_length=150, verbose_name='First Name')
    last_name = models.CharField(max_length=150, verbose_name='Last Name')
    birth_date = models.DateField(verbose_name='Birthdate',)
    sex = models.CharField(choices=sex, max_length=6, default='FEMALE', verbose_name='Sex')

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
    vehicle = models.CharField(max_length=125, verbose_name='Vehicle')

    def __str__(self) -> str:
        return f'{self.client}_{self.employment}'.replace(" ","-")

class Family(models.Model):
    id = models.AutoField( primary_key=True)
    client = models.ForeignKey( Client, on_delete=models.CASCADE, related_name="family")
    partner_salary = models.IntegerField()

    def __str__(self) -> str:
        return f'{self.partner_salary}'

class Son(models.Model):
    id = models.AutoField( primary_key=True)
    age = models.IntegerField(verbose_name='Edad')
    locality = models.ForeignKey(Locality, on_delete=models.CASCADE, verbose_name='Locality')
    address = models.CharField(max_length=45, verbose_name='Adress')
    family_client_user = models.ForeignKey(Family, on_delete=models.CASCADE, related_name="children")

    def __str__(self) -> str:
        return f'{self.age}'

class Tel(models.Model):
    id = models.AutoField( primary_key=True)
    phone_number = models.CharField(max_length=20, verbose_name='Phone number')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="tels" )
    
    def __str__(self) -> str:
        return f'{self.phone_number}'
