from django.db import models
from locality.models import Locality
from .choices import *


class Client(models.Model):
    id = models.IntegerField( primary_key=True)  
    postal = models.IntegerField(verbose_name='Código postal')
    address = models.TextField(max_length=100,verbose_name='Dirección')
    marital_status = models.CharField(choices=marital_status, max_length=100, verbose_name='Estado civil',)
    housing_type = models.CharField( choices=housing_type ,max_length=200, verbose_name='Tipo de Vivienda')  
    studies = models.CharField(choices=studies, max_length=200, verbose_name='nivel de educacion alcanzado')  
    locality = models.ForeignKey(Locality, on_delete=models.DO_NOTHING)  
    email = models.EmailField( unique=True,  verbose_name='correo electronico')
    id_type= models.CharField(choices=id_type,max_length=1 , verbose_name='Tipo de Documento')  
    id_number = models.IntegerField( unique=True, verbose_name='Número de Documento')  
    first_name = models.CharField(max_length=150, verbose_name='Nombre')
    last_name = models.CharField(max_length=150, verbose_name='Apellido')
    birth_date = models.DateField(verbose_name='Fecha de Nacimiento',)
    sex = models.CharField(choices=sex, max_length=1, default='F', verbose_name='Sexo')

    
    def __str__(self) -> str:
        return f'{self.locality}'    
    
        

class Patrimony(models.Model):
    id = models.IntegerField( primary_key=True)  
    client_user_id = models.OneToOneField(Client, on_delete=models.CASCADE)  
    employment = models.CharField(max_length=45,verbose_name='Empleo')
    salary = models.IntegerField(verbose_name='Salario')
    other_income = models.CharField(max_length=45,   verbose_name='Otros Ingresos')
    amount_other_income = models.IntegerField(  verbose_name='Monto Otros Ingresos')
    amount_retirement = models.IntegerField( verbose_name='Monto de Jubilación')
    amount_pension = models.IntegerField( verbose_name='Monto de Pensión')
    vehicle = models.CharField(max_length=125,  verbose_name='Vehículo')
 
  


class Family(models.Model):
    id = models.IntegerField( primary_key=True)  
    client_user_id = models.OneToOneField(Client, on_delete=models.CASCADE)  
    partner_salary = models.IntegerField()
 


class Son(models.Model):
    id = models.IntegerField( primary_key=True)  
    age = models.IntegerField(verbose_name='Edad')
    id_locality = models.ForeignKey(Locality, on_delete=models.DO_NOTHING, verbose_name='Localidad')
    address = models.CharField(max_length=45, verbose_name='Dirección')
    family_client_user = models.ForeignKey(Family, on_delete=models.CASCADE)
    
    def __str__(self) -> str:
        return f'{self.id_locality}'   
 
class Tel(models.Model):
    id = models.IntegerField( primary_key=True)  
    phone_number = models.IntegerField(verbose_name='Número de Teléfono')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, )
    
    def __str__(self) -> str:
        return f'{self.client}'   