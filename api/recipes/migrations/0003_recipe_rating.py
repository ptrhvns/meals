# Generated by Django 4.1.5 on 2023-01-31 21:23

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("recipes", "0002_tag"),
    ]

    operations = [
        migrations.AddField(
            model_name="recipe",
            name="rating",
            field=models.PositiveSmallIntegerField(
                blank=True,
                null=True,
                validators=[
                    django.core.validators.MinValueValidator(1),
                    django.core.validators.MaxValueValidator(5),
                ],
            ),
        ),
    ]