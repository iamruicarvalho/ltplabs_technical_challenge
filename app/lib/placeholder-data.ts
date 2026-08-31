/**
 * Static cart content, still used by the cart route until it is wired to real
 * state. The product listing and details pages now use the live API.
 */

export interface PlaceholderCartLine {
  id: string;
  title: string;
  price: number;
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
