from django.db import models
from locality.models import Locality
from .choices import *

class Client(models.Model):
    id = models.AutoField( primary_key=True)
    postal = models.IntegerField(verbose_name='Código postal')
    address = models.TextField(max_length=100,verbose_name='Dirección')
    marital_status = models.CharField(choices=marital_status, max_length=10, verbose_name='Estado civil',)
    housing_type = models.CharField( choices=housing_type ,max_length=20, verbose_name='Tipo de Vivienda')  
    studies = models.CharField(choices=studies, max_length=30, verbose_name='nivel de educacion alcanzado')  
    locality = models.ForeignKey(Locality, on_delete=models.CASCADE)  
    email = models.EmailField( unique=True,  verbose_name='correo electronico')
    id_type= models.CharField(choices=id_type,max_length=10, verbose_name='Tipo de Documento')  
    id_number = models.IntegerField( unique=True, verbose_name='Número de Documento')  
    first_name = models.CharField(max_length=150, verbose_name='Nombre')
    last_name = models.CharField(max_length=150, verbose_name='Apellido')
    birth_date = models.DateField(verbose_name='Fecha de Nacimiento',)
    sex = models.CharField(choices=sex, max_length=6, default='FEMALE', verbose_name='Sexo')

    def __str__(self) -> str:
        return f'{self.last_name} {self.first_name}'

class Patrimony(models.Model):
    id = models.AutoField( primary_key=True)  
    client = models.OneToOneField(Client, on_delete=models.CASCADE, related_name="patrimony")  
    employment = models.CharField(max_length=45,verbose_name='Empleo')
    salary = models.IntegerField(verbose_name='Salario',default=0)
    other_income = models.CharField(max_length=45,   verbose_name='Otros Ingresos')
    amount_other_income = models.IntegerField(  verbose_name='Monto Otros Ingresos',default=0)
    amount_retirement = models.IntegerField( verbose_name='Monto de Jubilación', default=0)
    amount_pension = models.IntegerField( verbose_name='Monto de Pensión', default=0)
    vehicle = models.CharField(max_length=125,  verbose_name='Vehículo')

    def __str__(self) -> str:
            return f'{self.id}_{self.client}_{self.employment}'.replace(" ","-")

class Family(models.Model):
    id = models.AutoField( primary_key=True)
    client = models.OneToOneField( Client, on_delete=models.CASCADE, related_name="family")
    partner_salary = models.IntegerField()

    def __str__(self) -> str:
            return f'{self.partner_salary}'

class Son(models.Model):
    id = models.AutoField( primary_key=True)
    age = models.IntegerField(verbose_name='Edad')
    locality = models.ForeignKey(Locality, on_delete=models.CASCADE, verbose_name='Localidad')
    address = models.CharField(max_length=45, verbose_name='Dirección')
    family_client_user = models.ForeignKey(Family, on_delete=models.CASCADE, related_name="children")

    def __str__(self) -> str:
            return f'{self.age}'

class Tel(models.Model):
    id = models.AutoField( primary_key=True)
    phone_number = models.CharField(max_length=20, verbose_name='Número de Teléfono')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="tels" )
    
    def __str__(self) -> str:
            return f'{self.phone_number}'
