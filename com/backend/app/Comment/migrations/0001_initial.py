# Generated by Django 4.1.4 on 2023-10-17 01:57

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('Consultation', '0005_alter_consultation_availability_state_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('time_stamp', models.DateTimeField(auto_now_add=True)),
                ('text', models.TextField()),
                ('consultation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comment', to='Consultation.consultation', verbose_name='consultation')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='comment', to=settings.AUTH_USER_MODEL, verbose_name='user')),
            ],
        ),
    ]
