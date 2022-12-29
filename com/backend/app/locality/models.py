'''
    Models is a python file that contains the definition of the database tables
'''
from django.db import models


class Nationality(models.Model):
    id = models.IntegerField(  primary_key=True)  
    name = models.CharField( max_length=100, verbose_name='Nacionalidad' )


class Province(models.Model):
  
    id = models.AutoField( primary_key=True)  
    name = models.CharField( max_length=100, verbose_name='Provincia' )
    nationality = models.ForeignKey (Nationality, 
                                        on_delete=models.CASCADE,# on_delete attribute specifies the behavior to adopt when the referenced object is deleted.
                                        related_name="provinces",# related_name attribute specifies the name of the reverse relation  
                                        verbose_name='Nacionalidad'# from the User model back to this model.
                                        )  
 
  
class Locality(models.Model):
    id = models.AutoField( primary_key=True)  
    name = models.CharField( max_length=100, verbose_name='Localidad' )
    province = models.ForeignKey(Province,
                                    related_name='localities',
                                    on_delete=models.CASCADE, 
                                    verbose_name='Provincia')   
    
    

 