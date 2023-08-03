from __future__ import annotations

from django.core import exceptions
from django.db.models import CASCADE, CharField, ForeignKey, Model, PositiveIntegerField
from django.utils.translation import gettext_lazy

from main.models.recipe import Recipe
from main.models.time_category import TimeCategory


class Time(Model):
    days = PositiveIntegerField(blank=True, null=True)
    hours = PositiveIntegerField(blank=True, null=True)
    minutes = PositiveIntegerField(blank=True, null=True)
    note = CharField(blank=True, default="", max_length=64)
    recipe = ForeignKey(Recipe, on_delete=CASCADE, related_name="times")
    time_category = ForeignKey(TimeCategory, on_delete=CASCADE, related_name="times")

    class Meta:
        db_table = "times"

    def __str__(self) -> str:
        d = f"{self.days}d" if self.days else None
        h = f"{self.hours}h" if self.hours else None
        m = f"{self.minutes}m" if self.minutes else None
        times = " ".join([t for t in [d, h, m] if t])
        return f"{self.time_category.name} {times}"

    def clean(self) -> None:
        units = ["days", "hours", "minutes"]

        if not any(getattr(self, u) for u in units):
            error = gettext_lazy("At least one unit is required.")
            raise exceptions.ValidationError({u: error for u in units})
