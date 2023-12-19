# Sistema de Gestión de Casos Judiciales

### Descripción
Este proyecto se centra en proporcionar una plataforma para la gestión de casos judiciales, facilitando el proceso de seguimiento y administración de información. <br/>


### Requerimientos Previos
Asegúrese de tener instalado uno de los siguientes:
- Docker
- Docker Compose (linux)
- Docker Desktop con WSL2 (windows)

### Configuraciones y Variables de Entorno
Se deberá configurar correctamente las variables de entorno y los archivos de configuración del backend y del frontend.
* Archivos de configuración del Backend y DB: 'com\backend\.envs'
* Archivo de variables de entorno del frontend: 'com\frontend\app\.env'
* Archivos templates para el envío de mails: 'com\backend\app\templates'

### Ejecutar Entorno

#### Paso 1: Navegación al Directorio "com"
Abra la terminal en la raíz del proyecto y navegue al directorio "com":
```bash
$ cd com
```

**Opción A: Desarrollo**
Genere los archivos estáticos del backend y del frontend, y luego ejecute el siguiente comando para levantar el entorno en modo desarrollo:
```bash
$ docker-compose up --build
```
Para cerrar el programa, presione CTRL+C sobre la terminal.<br />

**Opción B: Produccion**
Para ejecutar en modo producción, utilice el siguiente comando:
```bash
$ docker-compose -f docker-compose.prod.yml up -d --build
```
Para terminar el contenedor en segundo plano, ejecute el siguiente comando sobre la terminal, suponiendo que se encuentra en la carpeta "com":
```bash
$ docker-compose stop
```


#### Paso 2: Acceso a la Plataforma
Una vez que el entorno esté en ejecución, acceda a la plataforma a través de su navegador web utilizando la siguiente URL:
http://localhost

## Funcionalidades Principales
* Simplificar y optimizar la gestión de casos en entornos académicos y profesionales.
* Facilitar la asignación de casos a las diferentes comisiones mediante tableros dinámicos.
* Mejorar la organización de los casos mediante calendarios, tarjetas y tableros.
* Facilitar el control y supervisión por parte de un usuario administrador.
* Facilitar el ingreso de datos a partir del uso de formularios amigables, simples y autogestionables. 

### Bibliografía
- Guia de instalación Docker-Compose: https://docs.docker.com/compose/install/
- Requerimientos: https://docs.google.com/document/d/1R_bn0gh52T_PlmQBqGulFNdGhXG1EoLetDbJw8RX9h0/edit#heading=h.pg57bvdzqaqy
- Conf-Management: https://docs.google.com/document/d/1ZTQP-v9SodzzWGhIQaHo2NQn-SFULNu3V2kvid4Ad70/edit#heading=h.6x0jp637weid
