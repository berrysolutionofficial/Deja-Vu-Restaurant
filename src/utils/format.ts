// Utility function to format prices with commas: e.g. Rs. 2,585
export function formatPrice(price: number): string {
  if (isNaN(price)) return 'Rs. 0';
  return `Rs. ${price.toLocaleString('en-US')}`;
}
