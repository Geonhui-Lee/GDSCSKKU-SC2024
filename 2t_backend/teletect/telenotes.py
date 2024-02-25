import json
from dotenv import dotenv_values
from fastapi import UploadFile

from google.cloud import storage
from google.cloud import speech_v1p1beta1 as speech
from vertexai.preview.generative_models import ChatSession

from teletect.common.llm import get_chat_response
from teletect.common.credentials import get_google_application_credentials

BUCKET_NAME = dotenv_values(".env")["GOOGLE_CLOUD_STORAGE_TELENOTES_AUDIO_BUCKET_NAME"]
def get_upload_path(filename: str) -> str:
    return f"user_recording/{filename}"

async def generate_gcs_uri_from_audio(telenotes_id: str, audio_file: UploadFile):
    storage_client: storage.Client = storage.Client(credentials=get_google_application_credentials())
    
    bucket = storage_client.bucket(BUCKET_NAME)
    
    file_format = audio_file.filename.split(".")[-1]
    print(file_format)
    file_name = f"{telenotes_id}.{file_format}"
    
    blob = bucket.blob(f"{get_upload_path(file_name)}")
    
    blob.upload_from_file(audio_file.file)
    gcs_uri = f"gs://{BUCKET_NAME}/{get_upload_path(file_name)}"
    
    return {
        "id": telenotes_id,
        "gcs_uri": gcs_uri
    }

async def generate_document_from_gcs_uri(chat: ChatSession, telenotes_id: str, gcs_uri: str):
    client = speech.SpeechClient(credentials=get_google_application_credentials())

    speaker_diarization_config = speech.SpeakerDiarizationConfig(
        enable_speaker_diarization=True,
        min_speaker_count=2,
        max_speaker_count=2,
    )

    # Configure request to enable Speaker diarization
    recognition_config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED,
        language_code="en-US",
        sample_rate_hertz=8000,
        diarization_config=speaker_diarization_config,
    )

    # Set the remote path for the audio file
    audio = speech.RecognitionAudio(
        uri=gcs_uri,
    )
    
    response = client.long_running_recognize(
        config=recognition_config, audio=audio
    ).result(timeout=300)
    
    result = response.results[-1]

    words_info = result.alternatives[0].words

    trans = []
    for word_info in words_info:
        trans.append({"word": word_info.word, "speaker": word_info.speaker_tag})

    speaker = trans[0]['speaker']
    sentence = ""
    split_sentence = []
    for item in trans:
        if speaker == item['speaker']:
            sentence = " ".join([sentence, item['word']])
        else:
            split_sentence.append({"speaker": speaker, "sentence": sentence})
            speaker = item['speaker']
            sentence = item['word']

    split_sentence.append({"speaker": speaker, "sentence": sentence}) 
    
    
    desc_prompt = f"{json.dumps(split_sentence)} 해당 대화를 간단하게 요약해줘"
    desc = get_chat_response(chat, desc_prompt)
    keywords_prompt = f"{json.dumps(split_sentence)} 해당 대화 속 키워드를 키워드1 키워드2 키워드3의 형식으로 한 줄의 문자열로 반환 해줘"
    keywords = get_chat_response(chat, keywords_prompt)
    keywords = keywords.split(" ")
    
    return {
        "id": telenotes_id,
        "document": {
            "transcript": split_sentence,
            "summary": {
                "description": desc,
                "lists": [],
                "keywords": keywords,
            }
        }
    }