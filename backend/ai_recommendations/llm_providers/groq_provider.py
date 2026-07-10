from groq import Groq
from django.conf import settings
from .base import LLMProvider


class GroqProvider(LLMProvider):
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)

    def generate_recommendation(self, item_info, inventory_data, example):

        response = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": f"""
                        src: {item_info}, inv_list: {inventory_data}
                        Recommend clothing items from inv_list that pair well with src.
                        IMPORTANT: Use only the numeric 'id' field from inv_list items. Never use names.
                        Reply ONLY in JSON.
                        Good_match: array of single key-value objects where key is item id as string and value is reason.
                        Complete_outfit: array of item ids as integers.
                        following is the example of reply requested
                        {example}
                        """,
                }
            ],
        )

        return response.choices[0].message.content
