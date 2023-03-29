from django.core.paginator import Paginator
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from main.lib.responses import data_response
from main.models.tag import Tag


class TagResponseSerializer(ModelSerializer):
    class Meta:
        model = Tag
        fields = ("id", "name")


@api_view(http_method_names=["GET"])
@permission_classes([IsAuthenticated])
def tags(request: Request) -> Response:
    tags = Tag.objects.filter(user=request.user).order_by("name").all()
    page_num = request.query_params.get("page")

    if page_num is None:
        serializer = TagResponseSerializer(tags, many=True)
        return data_response(data={"tags": serializer.data})

    paginator = Paginator(tags, per_page=10)
    page = paginator.get_page(page_num)
    serializer = TagResponseSerializer(page.object_list, many=True)

    return data_response(
        data={
            "pagination": {
                "page": page.number,
                "total": paginator.num_pages,
            },
            "tags": serializer.data,
        }
    )
