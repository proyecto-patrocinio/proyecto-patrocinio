# Generated by Django 4.1.4 on 2023-08-22 02:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('Board', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='BoardUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('board', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='boardusers', to='Board.board', verbose_name='Board')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='boardusers', to=settings.AUTH_USER_MODEL, verbose_name='User')),
            ],
        ),
    ]
