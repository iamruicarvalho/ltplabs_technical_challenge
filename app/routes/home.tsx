import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "E-commerce challenge" },
    { name: "description", content: "Technical challenge — starting point." },
  ];
}

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">
        E-commerce challenge
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        The app is running. Start building from here.
      </p>
    </main>
  );
}
