from django.shortcuts import render
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client


# Create your views here.
class GoogleLogin(SocialLoginView):

    adapter_class = GoogleOAuth2Adapter
    callback_url = "postmessage"
    client_class = OAuth2Client

    def post(self, request, *args, **kwargs):
        print("REQUEST DATA:", request.data)
        try:
            return super().post(request, *args, **kwargs)
        except Exception as e:
            import traceback

            traceback.print_exc()
            raise
