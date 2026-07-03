import json
from groq import APIError, RateLimitError
from django.shortcuts import get_object_or_404
from rest_framework import status
from wardrobe.models import ClothingItem
from .models import AiRecommendation
from .llm_providers.groq_provider import GroqProvider
from .llm_providers.gemini_provider import GeminiProvider


# get the llm
def get_llm_provider():
    return GroqProvider()


def Ai_Recommendation(item_info, inventory_data):

    example = """
            {
            "Good_match": [
                {
                "4": "A black maxi skirt provides a sophisticated and elegant contrast to the off-white shirt. The black color allows the golden pattern on the shirt to stand out beautifully, creating a chic and well-balanced ensemble."
                },
                {
                "3": "A vibrant red long skirt offers a bold and stylish contrast to the off-white shirt. This pairing creates striking visual interest, with the red adding warmth and personality that can complement the golden accents of the shirt."
                }
            ],
            "Complete_outfit": [2,3,4]
            }
            """

    # create instance of llm provider
    llm_provider = get_llm_provider()
    try:
        response_text = llm_provider.generate_recommendation(
            item_info, inventory_data, example
        )

    except RateLimitError as e:
        return (
            f"Rate limit exceeded, please try again later: {str(e)}",
            status.HTTP_429_TOO_MANY_REQUESTS,
        )
    except APIError as e:
        return (f"AI provider error: {str(e)}", status.HTTP_502_BAD_GATEWAY)

    response_text_split = list(response_text)
    cleaned_response = ""
    first_curly_index = 0
    last_curly_index = len(response_text_split) - 1
    found_first_curly = False

    for i in enumerate(response_text_split):
        if response_text_split[i[0]] == "{" and not found_first_curly:
            first_curly_index = i[0]
            found_first_curly = True
        if response_text_split[i[0]] == "}":
            last_curly_index = i[0]

    cleaned_response = "".join(
        response_text_split[first_curly_index : last_curly_index + 1]
    )

    try:

        return (json.loads(cleaned_response), status.HTTP_200_OK)

    except json.JSONDecodeError:
        return (
            "Failed to decode AI response",
            status.HTTP_400_BAD_REQUEST,
        )


def Save_Ai_Recommendations(item_id, ai_recommendations):
    item = get_object_or_404(ClothingItem, id=item_id)
    is_best_match = False
    for each_recommended_item in ai_recommendations["Good_match"]:
        best_matches = ai_recommendations["Complete_outfit"]

        for recommended_item_id, reason in each_recommended_item.items():
            recommended_item = get_object_or_404(ClothingItem, id=recommended_item_id)
            if int(recommended_item_id) in best_matches:
                is_best_match = True
            AiRecommendation.objects.create(
                item=item,
                recommended_item=recommended_item,
                reason=reason,
                best_match=is_best_match,
            )
            is_best_match = False
