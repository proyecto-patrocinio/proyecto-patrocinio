# Proyecto Patrocinio Backend


## Instalación
Generar un entorno virtual como por ejemplo con "conda" para python 3.11.

```bash
Conda create -n patrocinio python=3.11
conda activate patrocinio
```

Instalar requerimientos:
```bash
cd app
pip install -r requirements.txt
```
## Configurar base de datos
Primero se deberá contar con una base de datos postgres.
A modo de ejemplo, se levanta un contenedor ejecutando el siguiete comando desde la raíz del proyecto backend:
```bash
docker run -p 5432:5432 --env-file ".envs/.postgres.dev" postgres:15-alpine
```
A continuación se migra la tablas a la base de datos:
```bash
cd app
python manage.py makemigrations 
python manage.py flush --no-input # WARNING: Delete all data of database
python manage.py migrate
python manage.py collectstatic --no-input --clear
```

Se cargan los datos iniciales necesariós para el uso de la aplicación:
```bash
python manage.py loaddata init_load_data/nationality.json
python manage.py loaddata init_load_data/province.json
python manage.py loaddata init_load_data/locality.json
python manage.py loaddata init_load_data/groups_permissions.json
python manage.py loaddata init_load_data/sites.json
```

## Correr aplicación
Configuración de variables de entorno:
Se deberá setear las variables de entorno especificadas en el archivo "backend/.envs/.app.dev".

Se deberá crear un usuario administrador, para ello ejecute el siguiente comando y complete la información solicitada:
```bash
cd app
python manage.py createsuperuser
```

Para correr el programa ejecute:
```bash
python manage.py runserver
```

## Correr los test
Para la ejecución de test unitarios ejecute el siguiete comando desde el directorio app:
```bash
python manage.py test
```
Para verificar el coverage ejecute:
```bash
coverage run --source='.' manage.py test 
coverage report
```


## Generar schema:
Para la generación del schema de la aplicación con OpenAPI, la cual provee una documentación
de interés para el desarrollador ejecute los siguientes comandos:
```bash
pip install pyyaml uritemplate
python manage.py generateschema --file openapi-schema.yml
```
Esto generará un archivo .yaml que  podrá ser visualizado con pluguins dentro del editor de texto, 
webs como redocly, o la propia documentación de Postman junto con la generación de su colleción con la importación del archivo.

# Developer Notes
Para actualizar la carga inicial de grupos y permisos desde su base de datos ejecute:
python manage.py dumpdata auth.Group auth.Permission --indent 2 > init_load_data/groups_permissions_sites.json
