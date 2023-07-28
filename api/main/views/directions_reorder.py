from typing import Any, cast

from django.db.transaction import atomic
from django.shortcuts import get_list_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import IntegerField, ListSerializer, ModelSerializer

from main.lib.responses import invalid_request_data_response, no_content_response
from main.models.direction import Direction


class DirectionsReorderListSerializer(ListSerializer):
    def update(self, instance: list[Direction], validated_data: Any) -> list[Direction]:
        directions_mapping = {i.id: i for i in instance}  # type: ignore[attr-defined]
        validated_data_mapping = {d["id"]: d for d in validated_data}
        result = []

        for key, data in validated_data_mapping.items():
            result.append(
                cast(DirectionsReorderSerializer, self.child).update(
                    directions_mapping[key], {"order": data["order"]}
                )
            )

        return result


class DirectionsReorderSerializer(ModelSerializer):
    class Meta:
        model = Direction
        fields = ("id", "order")
        list_serializer_class = DirectionsReorderListSerializer

    # Specify the id field explicitly. This ensures that the id field is not
    # marked as readonly. Readonly fields are removed from validated_data during
    # updates. We need the id field to be in validated_data so that the list
    # serializer update can do its work properly.
    id = IntegerField()  # noqa: A003

    # TODO figure out how to programmatically obtain min and max values.
    order = IntegerField(max_value=2147483647, min_value=0, required=True)


@api_view(http_method_names=["POST"])
@permission_classes([IsAuthenticated])
def directions_reorder(request: Request) -> Response:
    request_directions = request.data["directions"]

    db_directions = get_list_or_404(
        Direction,
        pk__in=[rd["id"] for rd in request_directions],
        recipe__user=request.user,
    )

    serializer = DirectionsReorderSerializer(
        data=request_directions, instance=db_directions, many=True
    )

    if not serializer.is_valid():
        return invalid_request_data_response(serializer)

    with atomic():
        serializer.save()

    return no_content_response()
