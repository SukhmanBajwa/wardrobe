interface ClothingItem {
  id: number;
  name: string;
  description: string;
  image: File | null;
  image_url: string | null;
  tags: string[];
  category: string;
}
