interface ClothingItemCardProps {
  item: ClothingItem;
  onItemSelect?: (item: ClothingItem) => void;
  onEditSelect?: (item: ClothingItem) => void;
}
