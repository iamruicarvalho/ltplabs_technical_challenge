import type { Route } from "./+types/cart";
import { MinusIcon, PlusIcon, TrashIcon } from "~/components/icons";
import { formatPrice } from "~/lib/format";
import { PLACEHOLDER_CART, PLACEHOLDER_SUMMARY } from "~/lib/placeholder-data";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Cart · The Online Store" }];
}

export default function Cart() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
      {/* Line items */}
      <ul className="border-t border-gray-200">
        {PLACEHOLDER_CART.map((line) => (
          <li
            key={line.id}
            className="flex gap-4 border-b border-gray-200 py-5"
          >
            <div className="h-28 w-28 shrink-0 rounded-sm bg-gray-200 sm:h-32 sm:w-32" />

            <div className="flex flex-1 flex-col">
              <p className="text-sm text-gray-800">{line.title}</p>
              <p className="text-sm text-gray-600">{formatPrice(line.price)}</p>

              <div className="mt-auto flex items-center gap-4 pt-6">
                <div className="inline-flex items-center rounded-md border border-gray-300">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    className="grid h-8 w-9 place-items-center text-gray-600 hover:bg-gray-50"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm tabular-nums">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    className="grid h-8 w-9 place-items-center text-gray-600 hover:bg-gray-50"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  aria-label="Remove item"
                  className="text-gray-400 transition-colors hover:text-gray-700"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Cart summary */}
      <aside className="h-fit rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900">Cart Summary</h2>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-600">Subtotal</dt>
            <dd className="text-gray-900 tabular-nums">
              {PLACEHOLDER_SUMMARY.subtotal}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Shipping</dt>
            <dd className="text-gray-900 tabular-nums">
              {PLACEHOLDER_SUMMARY.shipping}
            </dd>
          </div>
          <div className="flex justify-between font-semibold">
            <dt className="text-gray-900">Total</dt>
            <dd className="text-gray-900 tabular-nums">
              {PLACEHOLDER_SUMMARY.total}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          className="mt-4 w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-slate-800"
        >
          Check out
        </button>
        <p className="mt-2 text-center text-xs text-gray-500">Or pay with PayPal</p>

        <hr className="my-5 border-gray-200" />

        <label htmlFor="promo" className="text-sm text-gray-700">
          Promo code
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="promo"
            type="text"
            placeholder="Enter code"
            className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-slate-900 focus:outline-none"
          />
          <button
            type="button"
            className="shrink-0 rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            Apply
          </button>
        </div>
      </aside>
    </div>
  );
}
