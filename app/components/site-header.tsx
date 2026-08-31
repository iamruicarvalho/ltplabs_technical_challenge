import { useState } from "react";
import { Link } from "react-router";

import { BagIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from "./icons";
import { useCart } from "~/lib/cart";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/" },
  { label: "About", to: "/" },
  { label: "Contact", to: "/" },
  { label: "Blog", to: "/" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, hydrated } = useCart();

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
          <button
            type="button"
            aria-label="Search"
            className="text-gray-700 hover:text-gray-950"
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            aria-label="Account"
            className="text-gray-700 hover:text-gray-950"
          >
            <UserIcon />
          </button>
          <Link
            to="/cart"
            aria-label={
              hydrated && itemCount > 0
                ? `Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`
                : "Cart"
            }
            className="relative text-gray-700 hover:text-gray-950"
          >
            <BagIcon />
            {hydrated && itemCount > 0 && (
              <span className="absolute -top-2 -right-2 grid h-4 min-w-4 place-items-center rounded-full bg-slate-900 px-1 text-[10px] leading-none font-medium text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-gray-200 px-4 py-2 sm:px-6 md:hidden">
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
