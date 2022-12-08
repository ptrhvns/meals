from django.urls import path
from django.urls.resolvers import URLPattern, URLResolver

from accounts import views

urlpatterns: list[URLPattern | URLResolver] = [
    path("login/", views.login),
    path("logout/", views.logout),
    path("signup/", views.signup),
    path("signup_confirmation/", views.signup_confirmation),
]
