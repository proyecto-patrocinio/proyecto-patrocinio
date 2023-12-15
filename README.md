# PROYECTO PATROCIONIO JURIDICO 
Este software es una plataforma de gestión, la cual comprende una API rest, una base de datos y frontend para interactuar con el usuario.<br/>
La plataforma busca permitir automatizar la asignación de casos a las distintas comisiones del Patrocinio con criterios cuantitativos y de acuerdo a la materia en la que interviene cada una. <br/>
Facilitar el control y supervisión por parte de las personas que ejercen la dirección del Patrocinio. <br/>
Facilitar el ingreso de datos a partir del uso de formularios amigables, simples y autogestionables. 

## Requerimientos previos: <br/>
 Se requiere tener instalado python 3, docker, docker-compose o docker destktop con WSL2 


## Configuraciones y variables de entorno
Se deberá configurar correctamente las variables de entorno y los archivos de configuración del backend y del frontend.
* Archivos de configuración del Backend y DB: 'com\backend\.envs'
* Archivo de variables de entorno del frontend: 'com\frontend\app\.env'
* Archivos templates para el envío de mails: 'com\backend\app\templates'


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

- Tercero: <br />
Ingrese al http://localhost


Es posible que, si persiste el error, debas borrar los archivos de migraciones en el directorio : com\backend\app\Clients\migrations <br/>
O reiniciar el contenedor. <br/>


## Confirmación de Creación de Cuenta Administrador

Con el email configurado en el archivo 'com\backend\.envs\.app' para el usuario administrador de django, deberá ingresarlo en la página 'http://127.0.0.1/confirm-email/'. Esto enviará un correo electrónico de confirmación de creación de cuenta. El usuario administrador debe revisar su bandeja de entrada y seguir las instrucciones para confirmar la creación de la cuenta.


## Configuración del Sitio

Es fundamental configurar adecuadamente el sitio con el dominio correspondiente para garantizar el funcionamiento correcto de las funcionalidades, como la confirmación de creación de cuenta a través del correo electrónico.

Para configurar el sitio, siga estos pasos:
1. Ingrese al panel de administración de Django.
2. Navegue a la sección "Sites" (Sitios).
3. MODIFIQUE (No elimine ni agregue uno nuevo) el sitio existente para reflejar el dominio correcto de su aplicación.

Asegúrese de que la configuración del sitio sea coherente con las variables seteadas en los archivos de configuración del frontend y backend.

### BIBLIOGRAFIA
- Guia de instalación Docker-Compose: https://docs.docker.com/compose/install/
- Instalación de python: https://www.python.org/downloads/
- Requerimientos: https://docs.google.com/document/d/1R_bn0gh52T_PlmQBqGulFNdGhXG1EoLetDbJw8RX9h0/edit#heading=h.pg57bvdzqaqy
- Conf-Management: https://docs.google.com/document/d/1ZTQP-v9SodzzWGhIQaHo2NQn-SFULNu3V2kvid4Ad70/edit#heading=h.6x0jp637weid
- Guia Deploy: https://testdriven.io/blog/dockerizing-django-with-postgres-gunicorn-and-nginx/
- Guia API: https://docs.hektorprofe.net/academia/django/api-rest-framework/
