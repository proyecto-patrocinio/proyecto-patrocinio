# pull official base image
FROM python:3.11.1-alpine

# set work directory
WORKDIR /usr/src/app
COPY . .
# set environment variables
#   - PYTHONDONTWRITEBYTECODE: Evita que Python escriba 
#      archivos pyc en el disco (equivalente a la python -B opción )
#   - PYTHONUNBUFFERED: evita que Python almacene en búfer stdout y 
#       stderr (equivalente a la python -u opción )
ENV PYTHONUNBUFFERED 1 
ENV PYTHONDONTWRITEBYTECODE 1 


# install psycopg2 dependencies
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev \
    && apk add dos2unix redis

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# if you are using windows, you need to run this command
RUN sed -i 's/\r$//g' /usr/src/app/entrypoint.sh
RUN dos2unix /usr/src/app/entrypoint.sh

# give permissions to entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]