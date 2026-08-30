import type { Route } from "./+types/product";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Product title · The Online Store" }];
}

const DESCRIPTION =
  "Praesent ullamcorper non metus non laoreet. Nam quis felis lorem. Nullam " +
  "pellentesque tristique nibh, a malesuada lacus. Donec ornare dolor a justo " +
  "venenatis tempus. Quisque sed dui et est lacinia interdum ac sed massa. " +
  "Curabitur ut urna massa. Proin ligula enim, vulputate nec diam vitae, " +
  "gravida ullamcorper nulla. Nulla ut velit ut erat ullamcorper aliquet et " +
  "auctor odio.";

export default function Product() {
  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
      <div className="aspect-4/3 w-full rounded-sm bg-gray-200 md:aspect-auto md:h-110" />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product title</h1>
        <p className="mt-1 text-xl font-bold text-gray-900">$129.99</p>

        <button
          type="button"
          className="mt-4 w-full rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-slate-800"
        >
          Add to Cart
        </button>

        <hr className="my-5 border-gray-200" />

        <h2 className="text-sm font-medium text-gray-900">Product Details</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{DESCRIPTION}</p>
      </div>
    </div>
  );
}
