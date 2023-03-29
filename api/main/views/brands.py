from django.core.paginator import Paginator
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.lib.responses import data_response
from main.models.brand import Brand


class BrandsResponseSerializer(ModelSerializer):
    class Meta:
        model = Brand
        fields = ("id", "name")


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def brands(request: Request) -> Response:
    brands = Brand.objects.filter(user=request.user).order_by("name").all()
    page_num = request.query_params.get("page")

    if page_num is None:
        serializer = BrandsResponseSerializer(brands, many=True)
        return data_response(data={"brands": serializer.data})

    paginator = Paginator(brands, per_page=10)
    page = paginator.get_page(page_num)
    serializer = BrandsResponseSerializer(page.object_list, many=True)

    return data_response(
        data={
            "pagination": {
                "page": page.number,
                "total": paginator.num_pages,
            },
            "brands": serializer.data,
        }
    )
