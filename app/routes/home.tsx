import { Link } from "react-router";

import type { Route } from "./+types/home";
import { ChevronDownIcon, ChevronRightIcon } from "~/components/icons";
import { PLACEHOLDER_PRODUCTS, formatPrice } from "~/lib/placeholder-data";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "The Online Store" },
    { name: "description", content: "Browse the catalogue." },
  ];
}

const CATEGORIES = ["Category 1", "Category 2", "Category 3", "Category 4"];
const PAGES = [1, 2, 3, 4, 5];

export default function Home() {
  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          Sort by
          <ChevronDownIcon className="h-4 w-4" />
        </button>
        <p className="text-sm text-gray-500">Showing 1–9 of 100</p>
      </div>

      <div className="mt-6 flex flex-col gap-10 lg:flex-row">
        {/* Product grid */}
        <div className="flex-1">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3">
            {PLACEHOLDER_PRODUCTS.map((product) => (
              <li key={product.id}>
                <Link
                  to={`/products/${product.id}`}
                  className="group block focus:outline-none"
                >
                  <div className="aspect-square w-full rounded-sm bg-gray-200 transition-opacity group-hover:opacity-90" />
                  <p className="mt-3 text-sm text-gray-800 group-hover:underline">
                    {product.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatPrice(product.price)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <nav
            className="mt-10 flex items-center justify-end gap-1.5"
            aria-label="Pagination"
          >
            {PAGES.map((page) => (
              <button
                key={page}
                type="button"
                aria-current={page === 1 ? "page" : undefined}
                className={
                  "grid h-8 w-8 place-items-center rounded-full text-sm " +
                  (page === 1
                    ? "bg-slate-900 text-white"
                    : "text-gray-600 hover:bg-gray-100")
                }
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              aria-label="Next page"
              className="grid h-8 w-8 place-items-center rounded-full text-gray-600 hover:bg-gray-100"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </nav>
        </div>

        {/* Categories filter */}
        <aside className="lg:w-52 lg:shrink-0">
          <h2 className="text-sm font-medium text-gray-900">Categories</h2>
          <ul className="mt-3 space-y-2.5 border-b border-gray-200 pb-4">
            {CATEGORIES.map((category) => (
              <li key={category}>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900"
                  />
                  {category}
                </label>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
