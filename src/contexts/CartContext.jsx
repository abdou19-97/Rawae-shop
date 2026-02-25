import React, { createContext, useContext, useEffect, useState } from "react";
// import products from "../data/products";
import { useProducts } from "../hooks/useProducts";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

function tieredUnitPrice(base, qty) {
  if (qty >= 10) return Math.round(base * 0.8);
  if (qty >= 5) return Math.round(base * 0.9);
  if (qty >= 3) return Math.round(base * 0.95);
  return base;
}

export function CartProvider({ children }) {
  const { products } = useProducts();
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });
  const [promo, setPromo] = useState(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  function add(productId, qty = 1) {
    setItems((prev) => {
      const found = prev.find((i) => i.id === productId);
      if (found)
        return prev.map((i) =>
          i.id === productId ? { ...i, qty: i.qty + qty } : i,
        );
      return [...prev, { id: productId, qty }];
    });
  }

  function remove(productId) {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  }
  function updateQty(productId, qty) {
    setItems((prev) =>
      prev.map((i) => (i.id === productId ? { ...i, qty } : i)),
    );
  }
  function clear() {
    setItems([]);
    setPromo(null);
  }

  function applyPromo(code) {
    const map = { RAWA10: 0.1, RAWA20: 0.2 };
    if (map[code]) {
      setPromo({ code, percent: map[code] });
      return { ok: true };
    }
    return { ok: false, message: "Invalid code" };
  }

  function compute() {
    let subtotal = 0;
    let original = 0;
    let savings = 0;
    let cashback = 0;
    const detailed = items.map((it) => {
      const p = products.find((x) => x.id === it.id);
      const unit = tieredUnitPrice(p.basePrice, it.qty);
      const origUnit = p.basePrice;
      const line = unit * it.qty;
      subtotal += line;
      original += origUnit * it.qty;
      savings += (origUnit - unit) * it.qty;
      cashback += Math.round(line * 0.05);
      return { ...p, qty: it.qty, unit, origUnit, line };
    });
    let promoAmount = 0;
    if (promo) {
      promoAmount = Math.round(subtotal * promo.percent);
      subtotal -= promoAmount;
    }
    const totalSavings = savings + promoAmount;
    return {
      detailed,
      subtotal,
      original,
      totalSavings,
      cashback,
      promoAmount,
    };
  }

  return (
    <CartContext.Provider
      value={{
        items,
        add,
        remove,
        updateQty,
        clear,
        applyPromo,
        promo,
        compute,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
