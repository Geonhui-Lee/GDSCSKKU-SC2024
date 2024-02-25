from dotenv import dotenv_values
from google.oauth2 import service_account
import json

def get_google_application_credentials():
    credentials = service_account.Credentials.from_service_account_info(
        json.loads(dotenv_values(".env")["GOOGLE_APPLICATION_CREDENTIALS"])
    )
    return credentials