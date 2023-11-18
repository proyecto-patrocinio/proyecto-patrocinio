# PROYECTO PATROCIONIO JURIDICO 
Este software es una plataforma de gestión, la cual comprende una API rest, una base de datos y frontend para interactuar con el usuario.<br/>
La plataforma busca permitir automatizar la asignación de casos a las distintas comisiones del Patrocinio con criterios cuantitativos y de acuerdo a la materia en la que interviene cada una. <br/>
Facilitar el control y supervisión por parte de las personas que ejercen la dirección del Patrocinio. <br/>
Facilitar el ingreso de datos a partir del uso de formularios amigables, simples y autogestionables. 

## Requerimientos previos: <br/>
 Se requiere tener instalado python 3, docker, docker-compose o docker destktop con WSL2 

## EJECUTAR LA UNIDAD DEL PROYECTO
- Primero: <br />
Abro la terminal en la raiz del proyecto y me dirijo al directorio "com" <br/>
\$ cd com <br />
- Segundo: <br />
Ejecuto el contenedor:
  - A- En desarrollo ejecute: <br />
  \$ docker-compose up --build <br />
    Para cerrar el programa, presione CTRL+C sobre la terminal.<br/>
  - B- En produccion: <br />
  \$ docker-compose -f docker-compose.prod.yml up -d --build <br />
  Para terminar el contenedor en segundo plano, ejecute el siguiente comando sobre la terminal, suponiendo que se encuentra en la carpeta "com": <br/>
  \$ docker-compose stop

- Tercero <br />
Ingrese al http://localhost

## CREAR UN SUPER USUARIO
Luego de correr nuestro docker compose , ejecutamos el siguiente comando: <br/>
\$ docker exec -ti backend-app sh <br/>
Una vez dentro, lanzamos el comando para crear el usuario: <br/>
\$ python manage.py createsuperuser <br/>
Seguimos los pasos indicados por consola. <br/>
Salimos del contenedor: <br/>
\$ exit() <br />
Ante algun error o cambio del modelo, se pude hacer la migracion manualmente: <br/> 
  - docker exec -ti backend-app sh <br/>
  - python manage.py makemigrations && python manage.py migrate <br/>
  - python manage.py createsuperuser <br/>

Es posible que, si persiste el error, debas borrar los archivos de migraciones en el directorio : com\backend\app\Clients\migrations <br/>
O reiniciar el contenedor. <br/>


### BIBLIOGRAFIA
- Guia de instalación Docker-Compose: https://docs.docker.com/compose/install/
- Instalación de python: https://www.python.org/downloads/
- Requerimientos: https://docs.google.com/document/d/1R_bn0gh52T_PlmQBqGulFNdGhXG1EoLetDbJw8RX9h0/edit#heading=h.pg57bvdzqaqy
- Conf-Management: https://docs.google.com/document/d/1ZTQP-v9SodzzWGhIQaHo2NQn-SFULNu3V2kvid4Ad70/edit#heading=h.6x0jp637weid
- Guia Deploy: https://testdriven.io/blog/dockerizing-django-with-postgres-gunicorn-and-nginx/
- Guia API: https://docs.hektorprofe.net/academia/django/api-rest-framework/
