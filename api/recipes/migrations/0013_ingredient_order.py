# Generated by Django 4.1.7 on 2023-03-07 22:49

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("recipes", "0012_ingredient"),
    ]

    operations = [
        migrations.AddField(
            model_name="ingredient",
            name="order",
            field=models.PositiveIntegerField(default=0),
        ),
    ]
