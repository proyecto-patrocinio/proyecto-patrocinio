# Generated by Django 4.1.4 on 2023-07-05 03:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Board', '0003_alter_board_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='board',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
