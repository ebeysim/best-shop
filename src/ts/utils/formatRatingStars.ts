export default function formatRatingStars(rating?: number): string {
  if (rating === undefined || rating === null || Number.isNaN(rating)) {
    return '★★★★★';
  }
  const clamped = Math.max(0, Math.min(5, rating));
  const fullStars = Math.floor(clamped);
  const hasHalf = clamped % 1 >= 0.5;
  const halfStar = hasHalf ? '⯪' : '';
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalf ? 1 : 0));
  return '★'.repeat(fullStars) + halfStar + '☆'.repeat(emptyStars);
}