import { useState } from "react";

import type { Route } from "./+types/product";
import { useCart } from "~/lib/cart";
import { formatPrice } from "~/lib/format";
import { getProduct } from "~/lib/products";

export function meta({ data }: Route.MetaArgs) {
  const title = data?.product.title ?? "Product";
  return [{ title: `${title} · The Online Store` }];
}

export async function loader({ params }: Route.LoaderArgs) {
  const product = await getProduct(params.productId);
  return { product };
}

export default function Product({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData;
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);

  const inCart = items.find((item) => item.id === product.id)?.quantity ?? 0;
  const outOfStock = product.stock <= 0;
  const atMax = inCart >= product.stock;

  function handleAddToCart() {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      stock: product.stock,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 500);
  }

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
      <img
        className="aspect-square w-full rounded-sm bg-gray-100 object-contain p-6 md:aspect-auto md:h-[28rem]"
        src={product.thumbnail}
        alt={product.title}
      />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
        <p className="mt-1 text-xl font-bold text-gray-900">
          {formatPrice(product.price)}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {outOfStock ? "Out of stock" : `${product.stock} in stock`}
        </p>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock || atMax}
          className="mt-4 w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:bg-gray-300"
        >
          {outOfStock
            ? "Out of stock"
            : atMax
              ? "Max quantity in cart"
              : added
                ? "Added to cart"
                : "Add to Cart"}
        </button>

        <hr className="my-5 border-gray-200" />

        <h2 className="text-sm font-medium text-gray-900">Product Details</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {product.description}
        </p>
      </div>
    </div>
  );
}
