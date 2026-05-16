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
                model="gemini-3-flash-preview",
                contents=f"""
                        src: {item_info}, inv_list: {inventory_data}, Recommend clothing-items that pair with src.
                        Also tell best matches from all, one per category. 
                        Reply only JSON not text, 
                        Good_match w/ [] of clothing_id and 
                        Complete_outfit w/ [] of best options from one per category.
                        """
            )
            print(response)
            return Response(response.text)
        else:
            return Response({"error": "Invalid clothing Id"}, status=status.HTTP_400_BAD_REQUEST)