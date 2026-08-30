/**
 * Static content used only to build the UI. Real product / cart data is wired
 * up in a later step — nothing here talks to an API.
 */

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

export interface PlaceholderProduct {
  id: string;
  title: string;
  price: number;
}

export const PLACEHOLDER_PRODUCTS: PlaceholderProduct[] = [
  { id: "1", title: "Product title", price: 19.99 },
  { id: "2", title: "Product title", price: 49.99 },
  { id: "3", title: "Product title", price: 89.99 },
  { id: "4", title: "Product title", price: 39.99 },
  { id: "5", title: "Product title", price: 29.99 },
  { id: "6", title: "Product title", price: 59.99 },
  { id: "7", title: "Product title", price: 14.99 },
  { id: "8", title: "Product title", price: 79.99 },
  { id: "9", title: "Product title", price: 24.99 },
];

export interface PlaceholderCartLine extends PlaceholderProduct {
  quantity: number;
}

export const PLACEHOLDER_CART: PlaceholderCartLine[] = [
  { id: "1", title: "Product title", price: 199.99, quantity: 1 },
  { id: "2", title: "Product title", price: 89.99, quantity: 2 },
  { id: "3", title: "Product title", price: 59.99, quantity: 1 },
  { id: "4", title: "Product title", price: 19.99, quantity: 3 },
  { id: "5", title: "Product title", price: 49.99, quantity: 1 },
];

/** Static summary figures, matching the Figma mockup. */
export const PLACEHOLDER_SUMMARY = {
  subtotal: "$409.95",
  shipping: "$20.00",
  total: "$429.95",
};
