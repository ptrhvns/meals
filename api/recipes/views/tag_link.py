from django.db import Error
from django.db.transaction import atomic
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from recipes.models import Recipe, Tag
from shared.lib.responses import (
    created_response,
    internal_server_error_response,
    invalid_request_data_response,
    ok_response,
)


class TagRequestSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ("name",)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def tag_link(request: Request, recipe_id: int) -> Response:
    recipe = get_object_or_404(Recipe, pk=recipe_id, user=request.user)
    serializer = TagRequestSerializer(data=request.data)

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
