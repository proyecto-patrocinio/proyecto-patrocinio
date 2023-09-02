# Generated by Django 4.1.4 on 2023-08-29 21:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Board', '0001_initial'),
        ('Consultation', '0002_remove_requestconsultation_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='requestconsultation',
            name='destiny_board',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='request_consultations', to='Board.board', verbose_name='Tablero de destino'),
        ),
    ]