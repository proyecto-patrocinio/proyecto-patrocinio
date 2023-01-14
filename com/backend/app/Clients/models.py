from django.db import models
from .choices import *

# Create your models here.
class Client(models.Model):
    idclient = models.PositiveIntegerField( primary_key=True)  
    postal = models.PositiveIntegerField(null=False, verbose_name='Código postal')
    adress = models.TextField(verbose_name='Dirección')
    marital_status = models.CharField(choices=marital_status, max_length=1, verbose_name='Estado civil',)
    housing_type = models.CharField( choices=housing_type ,max_length=2, verbose_name='Tipo de Vivienda')  
    studies_idstudies = models.CharField(choices=studies, max_length=2, verbose_name='nivel de educacion alcanzado' )  
    #locality_idlocality = models.ForeignKey(Locality, on_delete=models.DO_NOTHING, )  
#    locality_province = models.ForeignKey('Locality', on_delete=models.DO_NOTHING, )  
#    locality_nationality = models.ForeignKey('Locality', on_delete=models.DO_NOTHING, to_field='nationality')  
    email = models.EmailField( unique=True,  verbose_name='correo electronico')
    id_type_idid_type = models.CharField(choices=id_type,max_length=1 , verbose_name='Tipo de Documento')  
    id_number = models.PositiveIntegerField( unique=True, verbose_name='Número de Documento')  
    first_name = models.CharField(max_length=150, verbose_name='Nombre')
    last_name = models.CharField(max_length=150, verbose_name='Apellido')
    birth_date = models.DateField(verbose_name='Fecha de Nacimiento',)
    sex = models.CharField(choices=sex, max_length=1, default='F', verbose_name='Sexo')


class Patrimony(models.Model):
    client_user_id = models.OneToOneField(Client, on_delete=models.CASCADE,primary_key=True)  
    employment = models.CharField(max_length=45,verbose_name='Empleo')
    salary = models.IntegerField(verbose_name='Salario')
    other_income = models.CharField(max_length=45,  blank=True, null=True, verbose_name='Otros Ingresos')
    amount_other_income = models.IntegerField(  blank=True, null=True,verbose_name='Monto Otros Ingresos')
    amount_retirement = models.IntegerField(blank=True, null=True, verbose_name='Monto de Jubilación')
    amount_pension = models.IntegerField(blank=True, null=True, verbose_name='Monto de Pensión')
    vehicle = models.CharField(max_length=125, blank=True, null=True, verbose_name='Vehículo')
 
  


class Family(models.Model):
    client_user_id = models.OneToOneField(Client, on_delete=models.CASCADE, primary_key=True)  
    partner_salary = models.IntegerField(blank=True, null=True)
 


class Son(models.Model):
    idson = models.AutoField(primary_key=True)
    age = models.IntegerField(verbose_name='Edad')
    #locality_idlocality = models.ForeignKey(Locality, on_delete=models.DO_NOTHING, verbose_name='Localidad')  
   # locality_province = models.ForeignKey(Locality, on_delete=models.DO_NOTHING,    to_field='province')  
   # locality_nationality = models.ForeignKey(Locality, on_delete=models.DO_NOTHING, to_field='nationality')  
    adess = models.CharField(max_length=45, verbose_name='Dirección')
    family_client_user = models.ForeignKey(Family, on_delete=models.CASCADE)  
 
class Tel(models.Model):
    idtel = models.AutoField( primary_key=True)  
    number = models.IntegerField(verbose_name='Número de Teléfono')
    Client = models.ForeignKey(Client, on_delete=models.CASCADE, )  