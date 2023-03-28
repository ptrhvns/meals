# Generated by Django 4.1.7 on 2023-03-28 21:31

from django.db import migrations, models
import django.db.models.constraints
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("recipes", "0014_alter_ingredient_unit"),
    ]

    operations = [
        migrations.CreateModel(
            name="Direction",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("description", models.TextField()),
                ("order", models.PositiveIntegerField(default=0)),
            ],
        ),
        migrations.AddConstraint(
            model_name="ingredient",
            constraint=models.UniqueConstraint(
                deferrable=django.db.models.constraints.Deferrable["DEFERRED"],
                fields=("order", "recipe"),
                name="ingredient_unique_order_recipe",
            ),
        ),
        migrations.AddField(
            model_name="direction",
            name="recipe",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="directions",
                to="recipes.recipe",
            ),
        ),
        migrations.AddConstraint(
            model_name="direction",
            constraint=models.UniqueConstraint(
                deferrable=django.db.models.constraints.Deferrable["DEFERRED"],
                fields=("order", "recipe"),
                name="direction_unique_order_recipe",
            ),
        ),
    ]
