from django.core.paginator import Paginator
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from recipes.models import Equipment
from shared.lib.responses import data_response


class EquipmentResponseSerializer(ModelSerializer):
    class Meta:
        model = Equipment
        fields = ("description", "id")


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def equipment(request: Request) -> Response:
    equipment = (
        Equipment.objects.filter(user=request.user).order_by("description").all()
    )
    page_num = request.query_params.get("page")

    if page_num is None:
        serializer = EquipmentResponseSerializer(equipment, many=True)
        return data_response(data={"equipment": serializer.data})

    paginator = Paginator(equipment, per_page=10)
    page = paginator.get_page(page_num)
    serializer = EquipmentResponseSerializer(page.object_list, many=True)

    return data_response(
        data={
            "pagination": {
                "page": page.number,
                "total": paginator.num_pages,
            },
            "equipment": serializer.data,
        }
    )
