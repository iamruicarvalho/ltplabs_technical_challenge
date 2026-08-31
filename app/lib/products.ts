import type { Category, Product, ProductsResponse } from "~/lib/types";

const BASE_URL = process.env.PRODUCTS_API_URL ?? "https://dummyjson.com";
export const PAGE_SIZE = 15;

export async function getProducts(page = 1): Promise<ProductsResponse> {
  const params = new URLSearchParams({
    limit: PAGE_SIZE.toString(),
    skip: ((page - 1) * PAGE_SIZE).toString(),
  });

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
