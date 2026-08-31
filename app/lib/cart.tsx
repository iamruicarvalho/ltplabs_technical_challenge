import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  stock: number;  // Units available at the time the item was added
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  hydrated: boolean;
  addItem: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clear: () => void;
}

const STORAGE_KEY = "cart:v1";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed)) setItems(parsed);
    } 
    catch {
      // corrupt or unavailable storage — start empty
    } 
    setHydrated(true);
  }, []);

  // Persist after every change, but not before the initial load has run.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full / unavailable
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (product: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((current) => {
        const max = product.stock ?? Infinity;
        if (max <= 0) return current; // out of stock

        const existing = current.find((item) => item.id === product.id);
        if (existing) {
          return current.map((item) =>
            item.id === product.id
              ? { ...item, quantity: Math.min(item.quantity + quantity, max) }
              : item,
          );
        }
        return [...current, { ...product, quantity: Math.min(quantity, max) }];
      });
    },
    [],
  );

  const setQuantity = useCallback((id: number, quantity: number) => {
    setItems((current) => {
      if (quantity <= 0) return current.filter((item) => item.id !== id);
      return current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.min(quantity, item.stock ?? Infinity) }
          : item,
      );
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return {
      items,
      itemCount,
      subtotal,
      hydrated,
      addItem,
      setQuantity,
      removeItem,
      clear,
    };
  }, [items, hydrated, addItem, setQuantity, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within <CartProvider>");
  }
  return ctx;
}
