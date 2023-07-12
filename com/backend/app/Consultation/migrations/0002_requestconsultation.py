# Generated by Django 4.1.4 on 2023-07-12 02:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Board', '0004_alter_board_id'),
        ('Consultation', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='RequestConsultation',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('consultation', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='Consultation.consultation', verbose_name='Consultation')),
                ('destiny_board', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Board.board')),
            ],
            options={
                'verbose_name': 'RequestConsultation',
                'verbose_name_plural': 'RequestConsultations',
            },
        ),
    ]
