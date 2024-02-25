from dotenv import dotenv_values

def get_origin_allowed():
    return dotenv_values(".env")["ORIGIN_ALLOWED"]

def get_gcp_project_id():
    return dotenv_values(".env")["GOOGLE_CLOUD_PLATFORM_PROJECT_ID"]

def get_gcp_location():
    return dotenv_values(".env")["GOOGLE_CLOUD_PLATFORM_LOCATION"]