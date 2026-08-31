import type { ReactNode } from "react";
import { Link } from "react-router";

import type { Route } from "./+types/home";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "~/components/icons";
import { formatPrice } from "~/lib/format";
import {
  getCategories,
  getProducts,
  getProductsByCategory,
  PAGE_SIZE,
  parseSort,
  searchProducts,
  sortProducts,
} from "~/lib/products";

const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating-desc", label: "Rating: high to low" },
  { value: "rating-asc", label: "Rating: low to high" },
  { value: "discountPercentage-desc", label: "Discount: high to low" },
  { value: "discountPercentage-asc", label: "Discount: low to high" },
];

export function meta(_: Route.MetaArgs) {
  return [
    { title: "The Online Store" },
    { name: "description", content: "Browse the catalogue." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const selected = url.searchParams.getAll("category");
  const sort = parseSort(url.searchParams.get("sort"));
  const sortValue = sort ? `${sort.field}-${sort.order}` : null;
  const q = url.searchParams.get("q")?.trim() ?? "";

  if (q) {
    const [categories, matches] = await Promise.all([
      getCategories(),
      searchProducts(q),
    ]);
    const valid = selected.filter((slug) =>
      categories.some((category) => category.slug === slug),
    );
    const validSet = new Set(valid);
    const filtered =
      validSet.size > 0
        ? matches.filter((product) => validSet.has(product.category))
        : matches;
    const sorted = sortProducts(filtered, sort);
    const startIndex = (page - 1) * PAGE_SIZE;

    return {
      products: sorted.slice(startIndex, startIndex + PAGE_SIZE),
      total: sorted.length,
      page,
      categories,
      selected: valid,
      sort: sortValue,
      q,
    };
  }

  if (selected.length === 0) {
    const [categories, { products, total }] = await Promise.all([
      getCategories(),
      getProducts(page, sort),
    ]);
    return { products, total, page, categories, selected, sort: sortValue, q };
  }

  const categories = await getCategories();

  // the API filters one category per request, so we fetch each selected category
  // in full and then merge them, sort and paginate the combined list here.
  const valid = selected.filter((slug) =>
    categories.some((category) => category.slug === slug),
  );
  const lists = await Promise.all(valid.map(getProductsByCategory));
  const sorted = sortProducts(lists.flat(), sort);
  const startIndex = (page - 1) * PAGE_SIZE;

  return {
    products: sorted.slice(startIndex, startIndex + PAGE_SIZE),
    total: sorted.length,
    page,
    categories,
    selected: valid,
    sort: sortValue,
    q,
  };
}

/** Listing URL that keeps the active category + sort state, overriding parts. */
function listHref(opts: {
  selected: string[];
  sort: string | null;
  q?: string;
  page?: number;
}): string {
  const params = new URLSearchParams();
  for (const s of opts.selected) params.append("category", s);

  if (opts.sort) params.set("sort", opts.sort);
  if (opts.q) params.set("q", opts.q);
  if (opts.page && opts.page > 1) params.set("page", String(opts.page));
  const query = params.toString();

  return query ? `/?${query}` : "/";
}

function toggleCategory(selected: string[], slug: string): string[] {
  return selected.includes(slug)
    ? selected.filter((s) => s !== slug)
    : [...selected, slug];
}

function pageList(current: number, count: number): (number | "gap")[] {
  const left = Math.max(2, current - 1);
  const right = Math.min(count - 1, current + 1);
  const pages: (number | "gap")[] = [1];

  if (left > 2) pages.push("gap");
  for (let i = left; i <= right; i++) pages.push(i);

  if (right < count - 1) pages.push("gap");
  if (count > 1) pages.push(count);

  return pages;
}

function PageArrow({
  to,
  disabled,
  label,
  children,
}: {
  to: string;
  disabled: boolean;
  label: string;
  children: ReactNode;
}) {
  const base = "grid h-8 w-8 place-items-center rounded-full text-gray-600";
  if (disabled) {
    return (
      <span aria-hidden className={`${base} opacity-30`}>
        {children}
      </span>
    );
  }

  return (
    <Link to={to} aria-label={label} className={`${base} hover:bg-gray-100`}>
      {children}
    </Link>
  );
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { products, total, page, categories, selected, sort, q } = loaderData;
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);
  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label;

  return (
    <div>
      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Product column */}
        <div className="flex-1">
          {q && (
            <p className="mb-4 text-sm text-gray-600">
              Results for{" "}
              <span className="font-medium text-gray-900">“{q}”</span>{" "}
              <Link
                to={listHref({ selected, sort })}
                className="text-gray-500 underline hover:text-gray-900"
              >
                clear
              </Link>
            </p>
          )}

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4">
            <details className="group relative">
              <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 [&::-webkit-details-marker]:hidden">
                {activeSortLabel ?? "Sort by"}
                <ChevronDownIcon className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="absolute left-0 z-10 mt-1 w-52 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                {[{ value: null, label: "Default" }, ...SORT_OPTIONS].map(
                  (option) => (
                    <Link
                      key={option.value ?? "default"}
                      to={listHref({ selected, sort: option.value, q })}
                      onClick={(e) =>
                        e.currentTarget.closest("details")?.removeAttribute("open")
                      }
                      className={
                        "block px-3 py-1.5 text-sm hover:bg-gray-50 " +
                        ((option.value ?? null) === (sort ?? null)
                          ? "font-medium text-gray-900"
                          : "text-gray-600")
                      }
                    >
                      {option.label}
                    </Link>
                  ),
                )}
              </div>
            </details>
            <p className="text-sm text-gray-500">
              Showing {start}–{end} of {total}
            </p>
          </div>

          {products.length === 0 ? (
            <p className="mt-10 text-sm text-gray-500">
              {q
                ? `No products match “${q}”.`
                : "No products match the selected categories."}
            </p>
          ) : (
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3">
              {products.map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/products/${product.id}`}
                    className="group block focus:outline-none"
                  >
                    <img
                      className="aspect-square w-full rounded-sm bg-gray-200 object-cover transition-opacity group-hover:opacity-90"
                      src={product.thumbnail}
                      alt={product.title}
                    />
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
          )}

          {/* Pagination */}
          {pageCount > 1 && (
            <nav
              className="mt-10 flex items-center justify-end gap-1.5"
              aria-label="Pagination"
            >
              <PageArrow
                to={listHref({ selected, sort, q, page: page - 1 })}
                disabled={page <= 1}
                label="Previous page"
              >
                <ChevronRightIcon className="h-4 w-4 rotate-180" />
              </PageArrow>

              {pageList(page, pageCount).map((entry, i) =>
                entry === "gap" ? (
                  <span
                    key={`gap-${i}`}
                    className="grid h-8 w-8 place-items-center text-sm text-gray-400"
                  >
                    …
                  </span>
                ) : (
                  <Link
                    key={entry}
                    to={listHref({ selected, sort, q, page: entry })}
                    aria-current={entry === page ? "page" : undefined}
                    className={
                      "grid h-8 w-8 place-items-center rounded-full text-sm " +
                      (entry === page
                        ? "bg-slate-900 text-white"
                        : "text-gray-600 hover:bg-gray-100")
                    }
                  >
                    {entry}
                  </Link>
                ),
              )}

              <PageArrow
                to={listHref({ selected, sort, q, page: page + 1 })}
                disabled={page >= pageCount}
                label="Next page"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </PageArrow>
            </nav>
          )}
        </div>

        {/* Categories filter */}
        <aside className="lg:w-52 lg:shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-900">Categories</h2>
            {selected.length > 0 && (
              <Link
                to={listHref({ selected: [], sort, q })}
                className="text-xs text-gray-500 hover:text-gray-900"
              >
                Clear
              </Link>
            )}
          </div>
          <ul className="mt-3 space-y-2.5 border-b border-gray-200 pb-4">
            {categories.map((category) => {
              const checked = selected.includes(category.slug);
              return (
                <li key={category.slug}>
                  <Link
                    to={listHref({
                      selected: toggleCategory(selected, category.slug),
                      sort,
                      q,
                    })}
                    aria-pressed={checked}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <span
                      aria-hidden
                      className={
                        "grid h-4 w-4 shrink-0 place-items-center rounded border " +
                        (checked
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-gray-300")
                      }
                    >
                      {checked && <CheckIcon className="h-3 w-3" />}
                    </span>
                    {category.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}
