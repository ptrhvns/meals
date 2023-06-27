from collections.abc import Callable, Sequence

from rest_framework.permissions import BasePermission
from rest_framework.response import Response


def sets_http_method_names(
    view: Callable[..., Response], expected_method_names: Sequence[str]
) -> bool:
    actual_method_names = view.view_class.http_method_names  # type: ignore[attr-defined]
    return (len(expected_method_names) == len(actual_method_names)) and (
        set(expected_method_names) == set(actual_method_names)
    )


def sets_permission_classes(
    view: Callable[..., Response],
    expected_permission_classes: Sequence[type[BasePermission]],
) -> bool:
    actual_permission_classes = view.view_class.permission_classes  # type: ignore[attr-defined]
    return (len(expected_permission_classes) == len(actual_permission_classes)) and (
        set(expected_permission_classes) == set(actual_permission_classes)
    )
