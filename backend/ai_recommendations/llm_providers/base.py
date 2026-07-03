from abc import ABC, abstractmethod


# Abstract class for all llm
class LLMProvider(ABC):
    @abstractmethod
    def generate_recommendation(self, item_info, inventory_data, example):
        """Returns raw response text from the LLM."""
        pass
