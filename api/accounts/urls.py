from django.urls import path
from django.urls.resolvers import URLPattern, URLResolver

from accounts import views

urlpatterns: list[URLPattern | URLResolver] = [
    path("account/destroy/", views.account_destroy),
    path("login/", views.login),
    path("logout/", views.logout),
    path("signup/create/", views.signup_create),
    path("signup_confirmation/update/", views.signup_confirmation_update),
]
