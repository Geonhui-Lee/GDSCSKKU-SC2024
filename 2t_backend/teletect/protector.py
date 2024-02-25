import feedparser
from fastapi import FastAPI, HTTPException
from bs4 import BeautifulSoup
import urllib.request
from vertexai.preview.generative_models import ChatSession
from teletect.common.llm import get_chat_response

RSS_URL = "https://news.google.com/rss/search?q=보이스피싱&hl=en-US&gl=US&ceid=US%3Aen"
RSS_MAX_ENTRIES = 5
RSS_MAX_ENTIRES_WITH_MEDIA = 3

async def get_protector_feed(include_media: bool = False):
    feed = feedparser.parse(RSS_URL)
    
    if feed.bozo == 1:
        raise HTTPException(status_code=500, detail="Invalid RSS feed")

    protector_feed = {
        "feed": {
            "title": feed.feed.title,
            "link": feed.feed.link,
            "description": feed.feed.description,
        },
        "entries": []
    }

    async def get_html_from_url(url) -> str:
        with urllib.request.urlopen(url) as response:
            html = response.read()
            return html
    
    entry_iteration_count = 0
    for entry in feed.entries[:RSS_MAX_ENTRIES]:
        def append_feed_without_media(entry):
            protector_feed["entries"].append({
                "title": entry.title,
                "link": entry.link,
                "source": entry.source.title,
                "date": entry.published,
            })
        
        if hasattr(entry, "title") and hasattr(entry, "link") and hasattr(entry, "published") and hasattr(entry, "source"):
            if include_media and entry_iteration_count < RSS_MAX_ENTIRES_WITH_MEDIA:
                try:
                    googlenews_url = entry.link
                    googlenews_html = await get_html_from_url(googlenews_url)
                    googlenews_soup = BeautifulSoup(googlenews_html, "html.parser")
                    googlenews_destination = googlenews_soup.find("a")["href"]
                    
                    content_url = googlenews_destination
                    content_html = await get_html_from_url(content_url)
                    content_soup = BeautifulSoup(content_html, "html.parser")
                    content_meta_image = content_soup.find("meta", property="og:image")["content"]
                    
                    protector_feed["entries"].append({
                        "title": entry.title,
                        "link": entry.link,
                        "source": entry.source.title,
                        "date": entry.published,
                        "media": [{
                            "type": "image",
                            "url": content_meta_image
                        }]
                    })
                except:
                    append_feed_without_media(entry)
            else:
                append_feed_without_media(entry)
        
        entry_iteration_count += 1

    return protector_feed

async def generate_report_explanation(chat: ChatSession, records: list):
    if len(records) == 0:
        raise HTTPException(status_code=400, detail="No records provided")
    
    if records["data"] == None or records["data"]["suspiciousParts"] == None:
        raise HTTPException(status_code=400, detail="No data provided")
    
    suspicious_parts: list = records["data"]["suspiciousParts"]
    suspicious_parts_joined = "\n".join(suspicious_parts)
    
    prompt = f"아래 부분이 보이스 피싱 의심되는 부분이야. 이걸 일반인 입장에서 정부에 문자로 신고하기 위해서 상황을 설명해주는 문자를 한 문단으로 작성해줘. (보낸이 정보 적지 말 것)\n\n{suspicious_parts_joined}"
    chat_response = str(get_chat_response(chat, prompt))
    return {
        "explanation": chat_response,
    }

async def check_whether_response_indicate_voice_phishing_confirmation(chat: ChatSession, response: str):
    prompt = f"아래 내용이 보이스 피싱에 대한 확인인지 **숫자로만** 답변해줘. (아닐 경우 0, 보이스피싱일 경우 1이라고 답변할 것)\n\n{response}"
    chat_response = str(get_chat_response(chat, prompt))
    is_voice_phishing = False
    if chat_response == "1":
        is_voice_phishing = True
    return {
        "isVoicePhishing": is_voice_phishing,
    }