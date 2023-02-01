from django.core.paginator import Paginator
from django.db import Error
from django.db.transaction import atomic
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from recipes.models import Recipe, Tag
from recipes.serializers import (
    RatingResponseSerializer,
    RatingUpdateRequestSerializer,
    RecipeCreateRequestSerializer,
    RecipeCreateResponseSerializer,
    RecipeResponseSerializer,
    RecipesResponseSerializer,
    RecipeTitleUpdateRequestSerializer,
    TagCreateRequestSerializer,
    TagLinkRequestSerializer,
    TagRecipesResponseSerializer,
    TagRequestSerializer,
    TagsResponseSerializer,
    TagUpdateRequestSerializer,
)
from shared.lib.responses import (
    created_response,
    data_response,
    internal_server_error_response,
    invalid_request_data_response,
    no_content_response,
    ok_response,
    unprocessable_entity_response,
)


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def rating(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    data = RatingResponseSerializer(instance=recipe).data
    return data_response(data=data)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def rating_destroy(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    recipe.rating = None
    recipe.save()
    return no_content_response()


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def rating_update(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    serializer = RatingUpdateRequestSerializer(data=request.data, instance=recipe)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    serializer.save()
    return no_content_response()


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def recipe(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    data = RecipeResponseSerializer(recipe).data
    return data_response(data=data)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def recipe_create(request: Request) -> Response:
    serializer = RecipeCreateRequestSerializer(data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    recipe = serializer.save(user=request.user)
    data = RecipeCreateResponseSerializer(instance=recipe).data
    return data_response(data=data)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def recipe_title_update(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    serializer = RecipeTitleUpdateRequestSerializer(data=request.data, instance=recipe)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    serializer.save()
    return no_content_response()


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def recipe_destroy(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    recipe.delete()
    return no_content_response()


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def recipes(request: Request) -> Response:
    recipes = Recipe.objects.filter(user=request.user).order_by("title").all()
    paginator = Paginator(recipes, per_page=10)
    page = paginator.get_page(request.query_params.get("page", 1))
    serializer = RecipesResponseSerializer(page.object_list, many=True)

    return data_response(
        data={
            "pagination": {
                "page": page.number,
                "total": paginator.num_pages,
            },
            "recipes": serializer.data,
        }
    )


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def tag(request: Request, tag_id: int) -> Response:
    tag = get_object_or_404(Tag, pk=tag_id, user=request.user)
    serializer = TagRequestSerializer(tag)
    return data_response(data=serializer.data)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def tag_create(request: Request) -> Response:
    serializer = TagCreateRequestSerializer(data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    try:
        created = (
            Tag.objects.get_or_create(
                defaults={"user": request.user, **serializer.validated_data},
                name__iexact=serializer.validated_data["name"],
                user=request.user,
            )
        )[0]
    except Error:
        return internal_server_error_response(
            message=_("Your information could not be saved.")
        )

    return created_response() if created else ok_response()


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def tag_link(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    serializer = TagLinkRequestSerializer(data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    try:
        with atomic():
            tag, created = Tag.objects.get_or_create(
                defaults={"user": request.user, **serializer.validated_data},
                name__iexact=serializer.validated_data["name"],
                user=request.user,
            )

            if not tag.recipes.contains(recipe):
                tag.recipes.add(recipe)
    except Error:
        return internal_server_error_response(
            message=_("Your information could not be saved.")
        )

    return created_response() if created else ok_response()


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def tags(request: Request) -> Response:
    tags = Tag.objects.filter(user=request.user).order_by("name").all()
    page_num = request.query_params.get("page")

    if page_num is None:
        serializer = TagsResponseSerializer(tags, many=True)
        return data_response(data={"tags": serializer.data})

    paginator = Paginator(tags, per_page=10)
    page = paginator.get_page(page_num)
    serializer = TagsResponseSerializer(page.object_list, many=True)

    return data_response(
        data={
            "pagination": {
                "page": page.number,
                "total": paginator.num_pages,
            },
            "tags": serializer.data,
        }
    )


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def tag_destroy(request: Request, tag_id: int) -> Response:
    tag = get_object_or_404(Tag, pk=tag_id, user=request.user)
    tag.delete()
    return no_content_response()


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def tag_recipes(request: Request, tag_id: int) -> Response:
    tag = get_object_or_404(Tag, pk=tag_id, user=request.user)
    paginator = Paginator(tag.recipes.order_by("title").all(), per_page=10)
    page = paginator.get_page(request.query_params.get("page", 1))
    serializer = TagRecipesResponseSerializer(page.object_list, many=True)

    return data_response(
        data={
            "pagination": {
                "page": page.number,
                "total": paginator.num_pages,
            },
            "recipes": serializer.data,
        }
    )


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def tag_unlink(request: Request, recipe_id: int, tag_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    tag = get_object_or_404(Tag, pk=tag_id, recipes=recipe, user=request.user)
    recipe.tags.remove(tag)  # type: ignore[attr-defined]
    return no_content_response()


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def tag_update(request: Request, tag_id: int) -> Response:
    tag = get_object_or_404(Tag, pk=tag_id, user=request.user)
    serializer = TagUpdateRequestSerializer(instance=tag, data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    if tag.name == serializer.validated_data["name"]:
        return no_content_response()

    # Use this test instead of a validator for a better user experience.
    if Tag.objects.filter(
        name=serializer.validated_data["name"], user=request.user
    ).exists():
        return unprocessable_entity_response(
            errors={"name": [_("This name is already taken.")]},
            message=_("The information you provided could not be saved."),
        )

    serializer.save()
    return no_content_response()
