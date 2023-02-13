#!/bin/sh
# Verify that the file is not saved with Windows line endings (CRLF).
# If it is, save it with Unix line endings (LF) and you will be fine.
# And UTF-8 without BOM (Byte Order Mark) 
# https://stackoverflow.com/questions/38905135/why-wont-my-docker-entrypoint-sh-execute

if [ "$DATABASE" = "postgres" ]
then
  echo "Waiting for postgres..."
  while ! nc -z $SQL_HOST $SQL_PORT; do
    sleep 0.1
  done

  echo "PostgreSQL started"
fi
#migrations
python manage.py makemigrations 
python manage.py flush --no-input
python manage.py migrate

#load initial data (the order is important)
python manage.py loaddata locality/load_data/nationality.json 
python manage.py loaddata locality/load_data/province.json 
python manage.py loaddata locality/load_data/locality.json 

#run test
python manage.py test
exec "$@"