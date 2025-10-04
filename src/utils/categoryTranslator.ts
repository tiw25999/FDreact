// Category translation utility
export const categoryMap: { [key: string]: string } = {
  'มือถือ': 'Mobile',
  'แล็ปท็อป': 'Laptop', 
  'อุปกรณ์เสริม': 'Accessories',
  'หูฟัง': 'Headphones',
  'กล้อง': 'Camera'
};

/**
 * Convert Thai category name to English
 * @param thaiCategory - Thai category name
 * @returns English category name
 */
export function translateCategory(thaiCategory: string): string {
  return categoryMap[thaiCategory] || thaiCategory;
}

/**
 * Convert English category name back to Thai (for API calls)
 * @param englishCategory - English category name
 * @returns Thai category name
 */
export function translateCategoryToThai(englishCategory: string): string {
  const reverseMap: { [key: string]: string } = {};
  Object.entries(categoryMap).forEach(([thai, english]) => {
    reverseMap[english] = thai;
  });
  return reverseMap[englishCategory] || englishCategory;
}

/**
 * Get all categories with both Thai and English names
 * @param thaiCategories - Array of Thai category names
 * @returns Array of objects with thai and english properties
 */
export function getCategoryOptions(thaiCategories: string[]) {
  return [
    { value: '', label: 'All Categories', thai: '', english: 'All Categories' },
    ...thaiCategories.map(c => ({
      value: c,
      label: translateCategory(c),
      thai: c,
      english: translateCategory(c)
    }))
  ];
}
