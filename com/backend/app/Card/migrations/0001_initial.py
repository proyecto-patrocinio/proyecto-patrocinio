# Generated by Django 4.1.4 on 2024-04-30 00:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("Panel", "0001_initial"),
        ("Consultation", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Card",
            fields=[
                (
                    "consultation",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        primary_key=True,
                        related_name="card",
                        serialize=False,
                        to="Consultation.consultation",
                        verbose_name="Consulta",
                    ),
                ),
                ("tag", models.CharField(max_length=256)),
                (
                    "panel",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="cards",
                        to="Panel.panel",
                        verbose_name="Panel",
                    ),
                ),
            ],
            options={
                "verbose_name": "Tarjetas",
                "verbose_name_plural": "Tarjetas",
                "ordering": ["tag"],
            },
        ),
    ]
