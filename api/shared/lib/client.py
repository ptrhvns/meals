from django.conf import settings


class ClientUrls:
    home = settings.BASE_CLIENT_URI
    signup_confirmation = settings.BASE_CLIENT_URI + "/signup-confirmation/{token}"
