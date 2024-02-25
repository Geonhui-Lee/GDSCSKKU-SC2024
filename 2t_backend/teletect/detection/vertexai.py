from vertexai.preview.generative_models import ChatSession
from teletect.common.llm import get_chat_response
from teletect.common.standard import output_detection_result

async def detect_voice_phishing_via_vertexai(chat: ChatSession, text: str):
    prompt = f"{text}, 이 문장이 보이스 피싱 사기와 큰 연관성이 있어? (0.0-1.0) 사이 스코어만 아웃풋으로 보여줘."
    score = int(get_chat_response(chat, prompt))
    return output_detection_result(score=score)