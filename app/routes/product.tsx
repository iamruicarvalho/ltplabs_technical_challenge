import { data, useFetcher } from "react-router";

import type { Route } from "./+types/product";
import {
  addLine,
  readCart,
  serializeCart,
} from "~/lib/cart.server";
import { formatPrice } from "~/lib/format";
import { getProduct } from "~/lib/products";

export function meta({ data: routeData }: Route.MetaArgs) {
  const title = routeData?.product.title ?? "Product";
  return [{ title: `${title} · The Online Store` }];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const [product, cart] = await Promise.all([
    getProduct(params.productId),
    readCart(request),
  ]);
  const inCart = cart.find((line) => line.id === product.id)?.quantity ?? 0;
  return { product, inCart };
}

export async function action({ request, params }: Route.ActionArgs) {
  const form = await request.formData();
  const quantity = Number(form.get("quantity")) || 1;

  const [product, cart] = await Promise.all([
    getProduct(params.productId),
    readCart(request),
  ]);
  const next = addLine(cart, product.id, quantity, product.stock);

  return data(
    { ok: true },
    { headers: { "Set-Cookie": await serializeCart(next) } },
  );
}

export default function Product({ loaderData }: Route.ComponentProps) {
  const { product, inCart } = loaderData;
  const fetcher = useFetcher<typeof action>();

  const adding = fetcher.state !== "idle";
  const outOfStock = product.stock <= 0;
  const atMax = inCart >= product.stock;

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
          {inCart > 0 && ` · ${inCart} in cart`}
        </p>

        <fetcher.Form method="post" className="mt-4">
          <input type="hidden" name="quantity" value="1" />
          <button
            type="submit"
            disabled={outOfStock || atMax || adding}
            className="w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:bg-gray-300"
          >
            {outOfStock
              ? "Out of stock"
              : atMax
                ? "Max quantity in cart"
                : adding
                  ? "Adding…"
                  : "Add to Cart"}
          </button>
        </fetcher.Form>

        <hr className="my-5 border-gray-200" />

        <h2 className="text-sm font-medium text-gray-900">Product Details</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {product.description}
        </p>
      </div>
    </div>
  );
}
