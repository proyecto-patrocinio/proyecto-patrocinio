# Generated by Django 4.1.4 on 2023-11-11 19:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Board', '0001_initial'),
        ('Clients', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Consultation',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('availability_state', models.CharField(choices=[('CREATED', 'Unassigned Created'), ('PENDING', 'Pending Assignment Request'), ('ASSIGNED', 'Assigned'), ('REJECTED', 'Unassigned Rejected'), ('ARCHIVED', 'Archived')], default='CREATED', max_length=12, verbose_name='Availability State')),
                ('progress_state', models.CharField(choices=[('TODO', 'To Do'), ('IN_PROGRESS', 'In Progress'), ('DONE', 'Done'), ('PAUSED', 'Paused'), ('BLOCKED', 'Blocked'), ('INCOMPLETE', 'Incomplete')], default='TODO', max_length=12, verbose_name='Progress State')),
                ('time_stamp', models.DateTimeField(auto_now_add=True)),
                ('description', models.TextField(blank=True)),
                ('opponent', models.CharField(max_length=500)),
                ('tag', models.CharField(max_length=30)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='consultations', to='Clients.client', verbose_name='Client')),
            ],
        ),
        migrations.CreateModel(
            name='RequestConsultation',
            fields=[
                ('consultation', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='request_consultations', serialize=False, to='Consultation.consultation', verbose_name='Consulta')),
                ('destiny_board', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='request_consultations', to='Board.board', verbose_name='Tablero de destino')),
            ],
            options={
                'verbose_name': 'RequestConsultation',
                'verbose_name_plural': 'RequestConsultations',
            },
        ),
    ]
