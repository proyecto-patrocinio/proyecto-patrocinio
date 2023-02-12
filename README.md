# PROYECTO PATROCIONIO JURIDICO 
 Requerimientos previos: <br />
 Se requiere tener instalado docker, docker-compose o docker destktop con WSL2 


## EJECUTAR ENTORNO
- Primero <br />
Abro la terminal en la raiz del proyecto y me dirijo al directorio "com"
$ cd com <br />
- A- En desarrollo ejecute: <br />
$ docker-compose up --build <br />
- B- En produccion: <br />
$ docker-compose -f docker-compose.prod.yml up -d --build <br />

- Segundo <br />
Ingrese al http://localhost


### BIBLIOGRAFIA
- Guia de istalacion Docker-Compose: https://docs.docker.com/compose/install/
- Instalacion de python: https://www.python.org/downloads/
- Requerimientos: https://docs.google.com/document/d/1R_bn0gh52T_PlmQBqGulFNdGhXG1EoLetDbJw8RX9h0/edit#heading=h.pg57bvdzqaqy
- Conf-Management: https://docs.google.com/document/d/1ZTQP-v9SodzzWGhIQaHo2NQn-SFULNu3V2kvid4Ad70/edit#heading=h.6x0jp637weid
- Guia Deploy: https://testdriven.io/blog/dockerizing-django-with-postgres-gunicorn-and-nginx/
- Guia API: https://docs.hektorprofe.net/academia/django/api-rest-framework/
