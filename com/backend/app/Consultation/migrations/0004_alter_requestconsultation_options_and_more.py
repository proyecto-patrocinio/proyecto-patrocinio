# Generated by Django 4.1.4 on 2024-04-27 21:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Clients', '0004_alter_child_address_alter_child_birth_date_and_more'),
        ('Consultation', '0003_alter_consultation_options_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='requestconsultation',
            options={'verbose_name': 'Solicitud de consulta', 'verbose_name_plural': 'Solicitudes de consultas'},
        ),
        migrations.AlterField(
            model_name='consultation',
            name='availability_state',
            field=models.CharField(choices=[('CREATED', 'Creado, sin asignar'), ('PENDING', 'Solicitud de asignación pendiente'), ('ASSIGNED', 'Asignado'), ('REJECTED', 'Rechazado, sin asignar'), ('ARCHIVED', 'Archivado')], default='CREATED', max_length=12, verbose_name='Estado de disponibilidad'),
        ),
        migrations.AlterField(
            model_name='consultation',
            name='client',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='consultations', to='Clients.client', verbose_name='Consultante'),
        ),
        migrations.AlterField(
            model_name='consultation',
            name='progress_state',
            field=models.CharField(choices=[('TODO', 'Por hacer'), ('IN_PROGRESS', 'En progreso'), ('DONE', 'Terminado'), ('PAUSED', 'Pausado'), ('BLOCKED', 'Bloqueado'), ('INCOMPLETE', 'Incompleto')], default='TODO', max_length=12, verbose_name='Estado de progreso'),
        ),
    ]
