export const comparisonLimit = 4;

export function toggleComparisonSelection(selectedIds: number[], propertyId: number) {
  if (selectedIds.includes(propertyId)) {
    return selectedIds.filter((id) => id !== propertyId);
  }

  return selectedIds.length >= comparisonLimit ? selectedIds : [...selectedIds, propertyId];
}
