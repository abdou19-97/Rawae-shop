import React, { createContext, useContext } from "react";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const productMethods = useProducts();
  const categoryMethods = useCategories();

  return (
    <ProductContext.Provider value={{ ...productMethods, ...categoryMethods }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within ProductProvider");
  }
  return context;
}
