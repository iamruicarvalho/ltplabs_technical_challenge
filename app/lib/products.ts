import type { Category, Product, ProductsResponse } from "~/lib/types";

const BASE_URL =
  (typeof process !== "undefined" && process.env.PRODUCTS_API_URL) ||
  "https://dummyjson.com";
export const PAGE_SIZE = 15;

export interface ProductSort {
  field: "price" | "discountPercentage" | "rating";
  order: "asc" | "desc";
}

export function parseSort(raw: string | null): ProductSort | null {
  if (!raw) return null;
  const [field, order] = raw.split("-");
  
  if (field !== "price" && field !== "discountPercentage" && field !== "rating") {
    return null;
  }
  if (order !== "asc" && order !== "desc") return null;
  
  return { field, order };
}

export async function getProducts(
  page = 1,
  sort: ProductSort | null = null,
): Promise<ProductsResponse> {
  const params = new URLSearchParams({
    limit: PAGE_SIZE.toString(),
    skip: ((page - 1) * PAGE_SIZE).toString(),
  });
  if (sort) {
    params.set("sortBy", sort.field);
    params.set("order", sort.order);
  }

  const res = await fetch(`${BASE_URL}/products?${params.toString()}`);
  if (!res.ok) {
    throw new Response("Failed to load products", { status: 502 });
  }

  return (await res.json()) as ProductsResponse;
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/products/categories`);
  if (!res.ok) {
    throw new Response("Failed to load categories", { status: 502 });
  }

  return (await res.json()) as Category[];
}


export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const res = await fetch(
    `${BASE_URL}/products/category/${encodeURIComponent(slug)}?limit=0`,
  );
  if (!res.ok) {
    throw new Response("Failed to load products", { status: 502 });
  }

  const data = (await res.json()) as ProductsResponse;
  return data.products;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const params = new URLSearchParams({ q: query, limit: "0" });
  const res = await fetch(`${BASE_URL}/products/search?${params.toString()}`);
  if (!res.ok) {
    throw new Response("Failed to search products", { status: 502 });
  }

  const data = (await res.json()) as ProductsResponse;
  return data.products;
}

export function sortProducts(
  list: Product[],
  sort: ProductSort | null,
): Product[] {
  return [...list].sort((a, b) => {
    if (!sort) return a.id - b.id;
    const diff = a[sort.field] - b[sort.field];
    return sort.order === "asc" ? diff : -diff;
  });
}

export async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${encodeURIComponent(id)}`);
  if (res.status === 404) {
    throw new Response("Product not found", { status: 404 });
  }
  if (!res.ok) {
    throw new Response("Failed to load product", { status: 502 });
  }

  return (await res.json()) as Product;
}
