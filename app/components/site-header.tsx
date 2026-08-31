import { useEffect, useRef, useState } from "react";
import { Form, Link, useSearchParams, useSubmit } from "react-router";

import { BagIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from "./icons";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/" },
  { label: "About", to: "/" },
  { label: "Contact", to: "/" },
  { label: "Blog", to: "/" },
];

/**
 * GET form that navigates to the listing with `?q=`. Typing submits the form
 * itself (debounced), so results update live without pressing enter. Active
 * category + sort ride along as hidden fields; `page` is omitted so results
 * start on page 1.
 */
function SearchForm({
  className = "",
  onClose,
}: {
  className?: string;
  onClose?: () => void;
}) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort");
  const categories = searchParams.getAll("category");
  const submit = useSubmit();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function scheduleSubmit(form: HTMLFormElement) {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => submit(form, { replace: true }), 300);
  }

  return (
    <Form
      method="get"
      action="/"
      role="search"
      onSubmit={() => clearTimeout(timer.current)}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose?.();
      }}
      className={className}
    >
      {categories.map((slug) => (
        <input key={slug} type="hidden" name="category" value={slug} />
      ))}
      {sort && <input type="hidden" name="sort" value={sort} />}
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        autoFocus={Boolean(onClose)}
        type="search"
        name="q"
        defaultValue={query}
        onChange={(event) => {
          const form = event.currentTarget.form;
          if (form) scheduleSubmit(form);
        }}
        placeholder="Search products"
        aria-label="Search products"
        className="w-full rounded-md border border-gray-300 bg-white py-1.5 pr-3 pl-8 text-sm shadow-sm placeholder:text-gray-400 focus:border-slate-900 focus:outline-none"
      />
    </Form>
  );
}

export function SiteHeader({ cartCount = 0 }: { cartCount?: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close the search popover on a click outside of it.
  useEffect(() => {
    if (!searchOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [searchOpen]);

  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <div className="flex flex-1 items-center gap-2">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="-ml-1 rounded-md p-1 text-gray-700 hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          <Link
            to="/"
            className="text-base font-bold uppercase tracking-[0.2em] whitespace-nowrap text-gray-900"
          >
            The Online Store
          </Link>
        </div>

        <nav className="hidden items-center justify-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm text-gray-700 transition-colors hover:text-gray-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-5">
          <div ref={searchRef} className="hidden md:flex md:items-center">
            {searchOpen ? (
              <SearchForm
                onClose={() => setSearchOpen(false)}
                className="relative w-56 lg:w-64"
              />
            ) : (
              <button
                type="button"
                aria-label="Search"
                aria-expanded={false}
                onClick={() => setSearchOpen(true)}
                className="flex text-gray-700 hover:text-gray-950"
              >
                <SearchIcon />
              </button>
            )}
          </div>

          <button
            type="button"
            aria-label="Account"
            className="flex text-gray-700 hover:text-gray-950"
          >
            <UserIcon />
          </button>
          <Link
            to="/cart"
            aria-label={
              cartCount > 0
                ? `Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`
                : "Cart"
            }
            className="relative flex text-gray-700 hover:text-gray-950"
          >
            <BagIcon />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 grid h-4 min-w-4 place-items-center rounded-full bg-slate-900 px-1 text-[10px] leading-none font-medium text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-gray-200 px-4 py-2 sm:px-6 md:hidden">
          <SearchForm className="relative my-2 w-full" />
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm text-gray-700 hover:text-gray-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
