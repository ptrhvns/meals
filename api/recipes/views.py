from typing import cast

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
    RecipeCreateRequestSerializer,
    RecipeCreateResponseSerializer,
    RecipeResponseSerializer,
    RecipesResponseSerializer,
    RecipeTitleUpdateRequestSerializer,
    TagAssociateRequestSerializer,
    TagsResponseSerializer,
)
from shared.lib.responses import (
    created_response,
    data_response,
    internal_server_error_response,
    invalid_request_data_response,
    no_content_response,
    ok_response,
)


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


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def tag_associate(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    serializer = TagAssociateRequestSerializer(data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    tag = Tag.objects.filter(
        name__iexact=serializer.validated_data["name"], user=request.user
    ).first()

    created = False

    try:
        with atomic():
            if not tag:
                tag = cast(Tag, serializer.save(user=request.user))
                created = True

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
    serializer = TagsResponseSerializer(tags, many=True)
    return data_response(data={"tags": serializer.data})


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def tag_dissociate(request: Request, recipe_id: int, tag_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    tag = get_object_or_404(Tag, pk=tag_id, recipes=recipe, user=request.user)
    recipe.tags.remove(tag)  # type: ignore[attr-defined]
    return no_content_response()
