# Generated by Django 4.1.4 on 2024-04-27 23:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Board', '0004_alter_board_options'),
        ('Panel', '0003_alter_panel_board'),
    ]

    operations = [
        migrations.AlterField(
            model_name='panel',
            name='board',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='panels', to='Board.board', verbose_name='Tablero'),
        ),
    ]
