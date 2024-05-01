# Generated by Django 4.1.4 on 2024-04-30 00:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("locality", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Client",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("first_name", models.CharField(max_length=150, verbose_name="Nombre")),
                (
                    "last_name",
                    models.CharField(max_length=150, verbose_name="Apellido"),
                ),
                (
                    "id_type",
                    models.CharField(
                        choices=[("DOCUMENT", "DNI"), ("PASSPORT", "Pasaporte")],
                        max_length=10,
                        verbose_name="Tipo de documento",
                    ),
                ),
                (
                    "id_value",
                    models.CharField(
                        max_length=20, unique=True, verbose_name="Num. de documento"
                    ),
                ),
                (
                    "sex",
                    models.CharField(
                        choices=[("MALE", "Masculino"), ("FEMALE", "Femenino")],
                        default="FEMALE",
                        max_length=6,
                        verbose_name="Sexo",
                    ),
                ),
                ("birth_date", models.DateField(verbose_name="Nacimiento")),
                ("address", models.TextField(max_length=100, verbose_name="Dirección")),
                ("postal", models.IntegerField(verbose_name="Código postal")),
                (
                    "marital_status",
                    models.CharField(
                        choices=[
                            ("SINGLE", "Soltero/a"),
                            ("MARRIED", "Casado/a"),
                            ("DIVORCED", "Divorciado/a"),
                            ("WIDOWER", "Viudo/a"),
                        ],
                        max_length=10,
                        verbose_name="Estado civil",
                    ),
                ),
                (
                    "housing_type",
                    models.CharField(
                        choices=[
                            ("HOUSE", "Casa"),
                            ("DEPARTMENT", "Departamento"),
                            ("TRAILER", "Remolque"),
                            ("STREET_SITUATION", "Situación de calle"),
                        ],
                        max_length=20,
                        verbose_name="Vivienda",
                    ),
                ),
                (
                    "studies",
                    models.CharField(
                        choices=[
                            ("INCOMPLETE_PRIMARY", "Primario incompleto"),
                            ("COMPLETE_PRIMARY", "Primario completo"),
                            ("INCOMPLETE_SECONDARY", "Secundario incompleto"),
                            ("COMPLETE_SECONDARY", "Secundario completo"),
                            ("INCOMPLETE_TERTIARY", "Terciario incompleto"),
                            ("COMPLETE_TERTIARY", "Terciario complero"),
                            ("INCOMPLETE_UNIVERSITY", "Iniversidad incompleta"),
                            ("COMPLETE_UNIVERSITY", "Universidad completa"),
                        ],
                        max_length=30,
                        verbose_name="Estudios",
                    ),
                ),
                (
                    "email",
                    models.EmailField(
                        max_length=254, unique=True, verbose_name="Email"
                    ),
                ),
                (
                    "employment",
                    models.CharField(
                        default="Desempleado", max_length=45, verbose_name="Empleo"
                    ),
                ),
                ("salary", models.IntegerField(default=0, verbose_name="Salario")),
                (
                    "other_income",
                    models.CharField(
                        default="No posee", max_length=45, verbose_name="Otros Ingresos"
                    ),
                ),
                (
                    "amount_other_income",
                    models.IntegerField(
                        default=0, verbose_name="Ingreso por otros ingresos"
                    ),
                ),
                (
                    "amount_retirement",
                    models.IntegerField(
                        default=0, verbose_name="Ingreso por jubilación"
                    ),
                ),
                (
                    "amount_pension",
                    models.IntegerField(default=0, verbose_name="Ingreso por pensión"),
                ),
                (
                    "vehicle",
                    models.CharField(
                        default="No posee", max_length=300, verbose_name="Vehículo"
                    ),
                ),
                ("partner_salary", models.IntegerField(default=0)),
                (
                    "locality",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="locality.locality",
                    ),
                ),
            ],
            options={
                "verbose_name": "Patrimonio",
                "verbose_name_plural": "Patrimonios",
            },
        ),
        migrations.CreateModel(
            name="Tel",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                (
                    "phone_number",
                    models.CharField(max_length=20, verbose_name="Número de teléfono"),
                ),
                (
                    "client",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="tels",
                        to="Clients.client",
                    ),
                ),
            ],
            options={
                "verbose_name": "Teléfono",
                "verbose_name_plural": "Teléfonos",
            },
        ),
        migrations.CreateModel(
            name="Child",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("first_name", models.CharField(max_length=150, verbose_name="Nombre")),
                (
                    "last_name",
                    models.CharField(max_length=150, verbose_name="Apellido"),
                ),
                (
                    "id_type",
                    models.CharField(
                        choices=[("DOCUMENT", "DNI"), ("PASSPORT", "Pasaporte")],
                        max_length=10,
                        verbose_name="Tipo de documento",
                    ),
                ),
                (
                    "sex",
                    models.CharField(
                        choices=[("MALE", "Masculino"), ("FEMALE", "Femenino")],
                        default="FEMALE",
                        max_length=6,
                        verbose_name="Sexo",
                    ),
                ),
                ("birth_date", models.DateField(verbose_name="Nacimiento")),
                ("address", models.TextField(max_length=100, verbose_name="Dirección")),
                (
                    "id_value",
                    models.CharField(max_length=20, verbose_name="Num. de documento"),
                ),
                (
                    "client_user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="children",
                        to="Clients.client",
                        verbose_name="familia",
                    ),
                ),
                (
                    "locality",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="locality.locality",
                    ),
                ),
            ],
            options={
                "verbose_name": "Hijo",
                "verbose_name_plural": "Hijos",
            },
        ),
    ]
