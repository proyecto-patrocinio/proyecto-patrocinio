# Generated by Django 4.1.4 on 2023-05-08 04:19

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Board',
            fields=[
                ('id', models.IntegerField(auto_created=True, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=45, unique=True)),
                ('is_consultancy', models.BooleanField()),
            ],
        ),
    ]
