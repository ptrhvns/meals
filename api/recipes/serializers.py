from rest_framework.serializers import ModelSerializer

from recipes.models import Recipe


class RecipeCreateRequestSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("title",)


class RecipeCreateResponseSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("id",)


class RecipeResponseSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("id", "title")


class RecipeTitleUpdateRequestSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("title",)
