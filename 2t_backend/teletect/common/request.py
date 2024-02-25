from fastapi import Request

async def get_body_from_json(request: Request) -> dict:
    return await request.json()