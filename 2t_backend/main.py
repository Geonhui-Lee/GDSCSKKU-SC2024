import json
from typing import Union
from dotenv import dotenv_values
from fastapi import FastAPI, HTTPException, Request, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from typing_extensions import Annotated
from urllib.parse import unquote

import vertexai
from google.cloud import speech_v1p1beta1 as speech
from vertexai.preview.generative_models import ChatSession, GenerativeModel

from teletect.common.environment_variable import get_gcp_location, get_gcp_project_id, get_origin_allowed
from teletect.common.request import get_body_from_json
from teletect.detection.kobert import detect_voice_phishing_via_kobert
from teletect.detection.vertexai import detect_voice_phishing_via_vertexai
from teletect.protector import generate_report_explanation, get_protector_feed, check_whether_response_indicate_voice_phishing_confirmation
from teletect.telenotes import generate_gcs_uri_from_audio, generate_document_from_gcs_uri
from teletect.test import get_hello_world

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:4000",
    "http://localhost:8100",
    get_origin_allowed()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

project_id = get_gcp_project_id()
location = get_gcp_location()
vertexai.init(project=project_id, location=location)
model = GenerativeModel("gemini-pro")
chat = model.start_chat()

@app.get("/")
def read_root():
    return get_hello_world()

@app.get("/detection/kobert")
async def detection_via_kobert(text: str):
    message = unquote(text)
    return await detect_voice_phishing_via_kobert(message)

@app.post("/detection/kobert")
async def detection_via_kobert_post(
    text: Annotated[str, Form()],
):
    message = unquote(text)
    return await detect_voice_phishing_via_kobert(message)

@app.get("/detection/vertexai")
async def detection_via_vertexai(text: str):
    message = unquote(text)
    return await detect_voice_phishing_via_vertexai(chat, message)

@app.post("/detection/vertexai")
async def detection_via_vertexai_post(
    text: Annotated[str, Form()],
):
    message = unquote(text)
    return await detect_voice_phishing_via_vertexai(chat, message)

@app.post("/telenotes/upload_audio")
async def telenotes_upload_audio(
    id: Annotated[str, Form()],
    file: Annotated[UploadFile, File()],
):
    return await generate_gcs_uri_from_audio(id, file)

@app.get("/telenotes/generate_document")
async def telenotes_generate_document(id: str, gcs_uri: str):
    return await generate_document_from_gcs_uri(chat, id, gcs_uri)

@app.get("/protector/feed")
async def protector_feed():
    return await get_protector_feed(include_media=True)

@app.post("/protector/investigation/generate_explaination")
async def protector_investigation_generate_explanation(request: Request):
    BODY = {
        "records": get_body_from_json(request).get("records")
    }
    return await generate_report_explanation(chat=chat, records=BODY["records"])


@app.post("/protector/investigation/human_response_confirmation")
async def protector_investigation_human_response_confirmation(request: Request):
    BODY = {
        "message": get_body_from_json(request).get("message")
    }
    return await check_whether_response_indicate_voice_phishing_confirmation(chat=chat, records=BODY["message"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
