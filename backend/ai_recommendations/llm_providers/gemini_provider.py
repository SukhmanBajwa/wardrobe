from google import genai
from django.conf import settings
from .base import LLMProvider


class GeminiProvider(LLMProvider):
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    def generate_recommendation(self, item_info, inventory_data, example):

        response = self.client.models.generate_content(
            # model="gemini-2.5-flash",
            model="gemini-3.1-flash-lite",
            # model="gemini-2.5-flash-lite",
            contents=f"""
                        src: {item_info}, inv_list: {inventory_data}
                        Recommend clothing items from inv_list that pair well with src.
                        IMPORTANT: Use only the numeric 'id' field from inv_list items. Never use names.
                        Reply ONLY in JSON.
                        Good_match: array of single key-value objects where key is item id as string and value is reason.
                        Complete_outfit: array of item ids as integers.
                        following is the example of reply requested
                        {example}
                        """,
        )

        return response.text
