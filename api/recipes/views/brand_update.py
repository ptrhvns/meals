from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from recipes.models import Brand
from shared.lib.responses import (
    invalid_request_data_response,
    no_content_response,
    unprocessable_entity_response,
)


class BrandRequestSerializer(ModelSerializer):
    class Meta:
        model = Brand
        fields = ("name",)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def brand_update(request: Request, brand_id: int) -> Response:
    brand = get_object_or_404(Brand, pk=brand_id, user=request.user)
    serializer = BrandRequestSerializer(instance=brand, data=request.data)

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    if brand.name == serializer.validated_data["name"]:
        return no_content_response()

    # Use this test instead of a validator for a better user experience.
    if Brand.objects.filter(
        name=serializer.validated_data["name"], user=request.user
    ).exists():
        return unprocessable_entity_response(
            errors={"name": [gettext_lazy("This name is already taken.")]},
            message=gettext_lazy("The information you provided could not be saved."),
        )

    serializer.save()
    return no_content_response()
