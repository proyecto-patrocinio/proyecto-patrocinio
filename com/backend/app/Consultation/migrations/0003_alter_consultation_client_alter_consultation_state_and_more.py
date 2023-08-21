# Generated by Django 4.1.4 on 2023-08-21 14:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Clients', '0001_initial'),
        ('Consultation', '0002_requestconsultation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='consultation',
            name='client',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='consultations', to='Clients.client', verbose_name='Cliente'),
        ),
        migrations.AlterField(
            model_name='consultation',
            name='state',
            field=models.CharField(choices=[('REGISTERED', 'Registered'), ('PENDING', 'Pending Assignment'), ('ASSIGNED', 'Assigned'), ('IN_PROGRESS', 'In Progress'), ('DONE', 'Done'), ('REJECTED', 'Rejected'), ('PAUSED', 'Paused'), ('BLOCKED', 'Blocked')], default='REGISTERED', max_length=12, verbose_name='Estado'),
        ),
        migrations.AlterField(
            model_name='requestconsultation',
            name='consultation',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='request_consultations', to='Consultation.consultation', verbose_name='Consulta'),
        ),
    ]