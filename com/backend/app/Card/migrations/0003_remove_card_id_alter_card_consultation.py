# Generated by Django 4.1.4 on 2023-07-11 02:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Consultation', '0001_initial'),
        ('Card', '0002_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='card',
            name='id',
        ),
        migrations.AlterField(
            model_name='card',
            name='consultation',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='cards', serialize=False, to='Consultation.consultation', verbose_name='Consultation'),
        ),
    ]
