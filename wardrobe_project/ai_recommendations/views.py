from django.shortcuts import render
from rest_framework.views import APIView
from wardrobe.models import ClothingItem
from wardrobe.serializers import ClothingItemSearializer
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

# import anthropic
from google import genai
import json

# client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
client = genai.Client(api_key=settings.GEMINI_API_KEY)


# Create your views here.
class RecommendationsAPIView(APIView):

    def get(self, request, id=None):
        if id:
            item = get_object_or_404(ClothingItem, id=id)
            serializer = ClothingItemSearializer(item)
            item_info = serializer.data

            inventory = ClothingItem.objects.filter(user=request.user)
            inventory_serializer = ClothingItemSearializer(inventory, many=True)
            inventory_data = inventory_serializer.data

            print(item_info, inventory_data)

            # message = client.messages.create(
            #     model="claude-sonnet-4-6",
            #     max_tokens=1024,
            #     messages=[{
            #         "role": "user",
            #         "content": f"{item_info} this the selected clothing item. Please recommend which of the following pairs well. Not restricted to one. And suggest the best pair. This list of the options are: {inventory_data}"
            #     }]
            # )

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=f"""
                        src: {item_info}, inv_list: {inventory_data}, Recommend clothing-items that pair with src.
                        Also tell best matches from all, one per category. 
                        Reply only JSON not text, 
                        Good_match w/ [] of clothing_id and 
                        Complete_outfit w/ [] of best options from one per category.
                        """,
            )
            print(
                "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$Raw AI response:"
            )
            print(response)

            response_text_split = list(response.text)
            cleaned_response = ""
            first_curly_index = 0
            last_curly_index = len(response_text_split) - 1
            print(type(response_text_split))
            for i in enumerate(response_text_split):
                if response_text_split[i[0]] == "{":
                    first_curly_index = i[0]
                if response_text_split[i[0]] == "}":
                    last_curly_index = i[0]

            cleaned_response = "".join(
                response_text_split[first_curly_index : last_curly_index + 1]
            )

            print(cleaned_response)

            try:
                decoded_json = json.loads(cleaned_response)
            except json.JSONDecodeError:
                return Response(
                    {"error": "Failed to decode AI response"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            return Response(decoded_json)
        else:
            return Response(
                {"error": "Invalid clothing Id"}, status=status.HTTP_400_BAD_REQUEST
            )
