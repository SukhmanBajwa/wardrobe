interface ClothingItem {
  id: number;
  name: string;
  description: string;
  image: File | null;
  tags: string[];
  category: string;
}
