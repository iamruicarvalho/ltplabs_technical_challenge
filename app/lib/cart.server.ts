import { createCookie } from "react-router";

/**
 * The cart lives in an httpOnly cookie: loaders read it, actions rewrite it and
 * send it back via `Set-Cookie`. Only `{ id, quantity }` is stored — titles,
 * prices and stock are looked up fresh when a route needs them.
 */
export interface CartLine {
  id: number;
  quantity: number;
}

const cartCookie = createCookie("cart", {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 30, // 30 days
});

export async function readCart(request: Request): Promise<CartLine[]> {
  const parsed = await cartCookie.parse(request.headers.get("Cookie"));
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(
    (line): line is CartLine =>
      !!line &&
      typeof line.id === "number" &&
      typeof line.quantity === "number" &&
      line.quantity > 0,
  );
}

export function serializeCart(lines: CartLine[]): Promise<string> {
  return cartCookie.serialize(lines);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

const clamp = (n: number, max: number) => Math.max(0, Math.min(n, max));

export function addLine(
  lines: CartLine[],
  id: number,
  quantity: number,
  max: number,
): CartLine[] {
  const existing = lines.find((line) => line.id === id);
  if (existing) {
    return lines.map((line) =>
      line.id === id
        ? { ...line, quantity: clamp(line.quantity + quantity, max) }
        : line,
    );
  }
  const q = clamp(quantity, max);
  return q > 0 ? [...lines, { id, quantity: q }] : lines;
}

export function setLineQuantity(
  lines: CartLine[],
  id: number,
  quantity: number,
  max: number,
): CartLine[] {
  if (quantity <= 0) return lines.filter((line) => line.id !== id);
  return lines.map((line) =>
    line.id === id ? { ...line, quantity: Math.min(quantity, max) } : line,
  );
}

export function removeLine(lines: CartLine[], id: number): CartLine[] {
  return lines.filter((line) => line.id !== id);
}
