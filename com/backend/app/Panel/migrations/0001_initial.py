# Generated by Django 4.1.4 on 2023-08-22 02:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Board', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Panel',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('board', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='panels', to='Board.board', verbose_name='Board')),
            ],
        ),
    ]
