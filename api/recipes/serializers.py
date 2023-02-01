from rest_framework.serializers import ModelSerializer

from recipes.models import Recipe, Tag


class RatingResponseSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("rating",)


class RatingUpdateRequestSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("rating",)


class RecipeCreateRequestSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("title",)


class RecipeCreateResponseSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("id",)


class RecipesResponseSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("id", "title")


class RecipeTitleUpdateRequestSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("title",)


class TagCreateRequestSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ("name",)


class TagLinkRequestSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ("name",)


class TagRequestSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name")


class TagRecipesResponseSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("id", "title")


class TagsResponseSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name")


class TagUpdateRequestSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ("name",)


class RecipeResponseSerializer(ModelSerializer):
    class Meta:
        model = Recipe
        fields = ("id", "rating", "tags", "title")

    tags = TagsResponseSerializer(many=True, required=False)
