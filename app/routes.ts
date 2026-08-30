import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"), // "/"              — product listing
  route("products/:productId", "routes/product.tsx"), // "/products/:id"  — product details
  route("cart", "routes/cart.tsx"), // "/cart"          — shopping cart
] satisfies RouteConfig;
