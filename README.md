# PROYECTO PATROCIONIO JURIDICO 
Este software es una plataforma de gestión, la cual comprende una API rest, una base de datos y frontend para interactuar con el usuario.<br/>
La plataforma busca permitir automatizar la asignación de casos a las distintas comisiones del Patrocinio con criterios cuantitativos y de acuerdo a la materia en la que interviene cada una. <br/>
Facilitar el control y supervisión por parte de las personas que ejercen la dirección del Patrocinio. <br/>
Facilitar el ingreso de datos a partir del uso de formularios amigables, simples y autogestionables. 

## Requerimientos previos: <br/>
 Se requiere tener instalado python 3, docker, docker-compose o docker destktop con WSL2 

## CREAR UNA APLICACION DJANGO 
1- Dirigase a la ruta de la App django <br/>
$ cd com\backend\app

2- Cree una virtual environment de python <br/>
$ python -m venv <name_env> 


3- Active el entorno virtual<br/>
$ name_env/Script/activate (windows) <br/>
$ source name_env/Script/activate (linux)


4- Instale los requerimientos<br />
(name_env) $ RUN pip install -r requirements.txt


5- Cree una nueva aplicacion Django<br />
(name_env) $ python manage.py startapp <mi_aplicación>.
(En este paso debera exportar manualmente las variable de entrono-> SET DJANGO_ALLOWED_HOSTS="localhost 127.0.0.1")


6- Abre el archivo mi_proyecto/settings.py y asegúrate de incluir rest_framework en la lista de INSTALLED_APPS. <br />
A continuación, escribe el nombre de la nueva App creada <mi_aplicación>


7- Crea tus modelos en mi_aplicación/models.py. Este modelo representará los datos que quieres almacenar en tu API, por ejemplo, productos, usuarios, etc. Asegúrate de hacer migrations para crear la tabla en la base de datos. <br />
Ejemplo:
<pre><code>
from django.db import models
class Pelicula(models.Model):
  titulo = models.CharField(max_length=150)
  estreno = models.IntegerField(default=2000)
  imagen = models.URLField(help_text="De imdb mismo")
  resumen = models.TextField(help_text="Descripción corta")

  class Meta:
    ordering = ['titulo']
</code></pre>


8- Crea tus serializadores en mi_aplicación/serializers.py. Los serializadores se encargan de convertir tus objetos de modelo en formato JSON y viceversa. <br />
Ejemplo:
<pre><code>
 from .models import Pelicula
from rest_framework import serializers

class PeliculaSerializer(serializers.ModelSerializer):
  class Meta:
    model = Pelicula
    # fields = ['id', 'titulo', 'imagen', 'estreno', 'resumen']
    fields = '__all__'
 
</code></pre>


9- Programa los viewset de DRF  <br />
algunos suelen crear un archivo llamado api.py en mi_aplicación/api.py.  <br />
Sino se puede escribir dentro de mi_aplicación/views.py <br />
Ejemplo:
<pre><code>
from rest_framework import viewsets

class PeliculaViewSet(viewsets.ModelViewSet):
  queryset = Pelicula.objects.all()
  serializer_class = PeliculaSerializer
</code></pre>
 

10- Añadimos los Urls a urls.py <br />
Ejemplo:
<pre><code>
from django.contrib import admin
from django.urls import path, include

from api import views
from rest_framework import routers

router = routers.DefaultRouter()

# En el router vamos añadiendo los endpoints a los viewsets
router.register('peliculas', views.PeliculaViewSet)

urlpatterns = [
  path('api/v1/', include(router.urls)),
  path('admin/', admin.site.urls),
]
</code></pre>


11- Configuramos los permisos de los view sets en settings.py <br />
Ejemplo, este da permisos de lectura a todos (no recomendable):
<pre><code> 
REST_FRAMEWORK = {
  'DEFAULT_PERMISSION_CLASSES': [                     
    'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly',
  ],
}
</code></pre>



## EJECUTAR DOCKER COMPOSE 
- Primero:
\$ docker-compose build  <br />
\$ docker-compose up -d

- Desarrollo:
\$ docker-compose -f docker-compose.yml down -v <br />
\$ docker-compose exec backend-app python manage.py flush --no-input <br />
\$ docker-compose exec backend-app python manage.py migrate

- Produccion:
\$ docker-compose -f docker-compose.prod.yml down -v <br />
\$ docker-compose -f docker-compose.prod.yml up -d --build <br />
\$ docker-compose -f docker-compose.prod.yml exec backend-app python manage.py migrate --noinput <br />
\$ docker-compose -f docker-compose.prod.yml exec backend-app python manage.py collectstatic --no-input --clear

## CREAR UN SUPER USUARIO
Luego de correr nuestro docker compose , ejecutamos el siguiente comando: <br/>
\$ docker exec -ti backend-app sh <br/>
Una vez dentro, lanzamos el comando para crear el usuario: <br/>
\$ python manage.py createsuperuser <br/>
\$ exit() <br />
        Ante algun error o cambio del modelo, se pude hacer la migracion manualmente. <br/>
        Es posible que ante si no funciona debas borrar los archivos de migraciones 001. 002 ... <br/>
        O reiniciar el contenedor. <br/>
    - docker exec -ti backend-app sh <br/>
    - python manage.py makemigrations && python manage.py migrate <br/>
    - python manage.py createsuperuser <br/>



### BIBLIOGRAFIA
- Guia de istalacion Docker-Compose: https://docs.docker.com/compose/install/
- Instalacion de python: https://www.python.org/downloads/
- Requerimientos: https://docs.google.com/document/d/1R_bn0gh52T_PlmQBqGulFNdGhXG1EoLetDbJw8RX9h0/edit#heading=h.pg57bvdzqaqy
- Conf-Management: https://docs.google.com/document/d/1ZTQP-v9SodzzWGhIQaHo2NQn-SFULNu3V2kvid4Ad70/edit#heading=h.6x0jp637weid
- Guia Deploy: https://testdriven.io/blog/dockerizing-django-with-postgres-gunicorn-and-nginx/
- Guia API: https://docs.hektorprofe.net/academia/django/api-rest-framework/
