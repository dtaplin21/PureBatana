/**
 * Utility functions for the server
 */

/**
 * Generates a formatted order number in the format PB00000
 * @param orderId the numeric order ID to format
 * @returns formatted order number (e.g., PB00123)
 */
export function generateOrderNumber(orderId: number): string {
  // Pad the order ID with leading zeros to make it 5 digits
  const paddedId = orderId.toString().padStart(5, '0');
  return `PB${paddedId}`;
}

/**
 * Extracts the numeric ID from a formatted order number
 * @param orderNumber the formatted order number (e.g., PB00123)
 * @returns the numeric ID or null if invalid format
 */
export function extractOrderIdFromNumber(orderNumber: string): number | null {
  // Check if the order number follows the expected format
  const pattern = /^PB(\d{5})$/;
  const match = orderNumber.match(pattern);
  
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  
  return null;
}