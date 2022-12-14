from rest_framework.serializers import ModelSerializer

from recipes.models import Recipe


class RecipeCreateSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("title",)
