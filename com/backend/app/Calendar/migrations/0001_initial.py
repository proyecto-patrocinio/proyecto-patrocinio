# Generated by Django 4.1.4 on 2023-12-19 03:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Calendar',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=45)),
                ('description', models.TextField(blank=True, null=True)),
                ('start', models.DateTimeField()),
                ('end', models.DateTimeField()),
                ('calendar', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events', to='Calendar.calendar')),
            ],
        ),
    ]
