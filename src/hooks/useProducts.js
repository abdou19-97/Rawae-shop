import { useState, useEffect } from "react";
import defaultProducts from "../data/products";

const STORAGE_KEY = "rawae_products";

export function useProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProducts(JSON.parse(stored));
      } else {
        // Initialize with default products
        setProducts(defaultProducts);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
      }
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts(defaultProducts);
    }
  };

  const saveProducts = (newProducts) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
      setProducts(newProducts);
      return true;
    } catch (error) {
      console.error("Error saving products:", error);
      return false;
    }
  };

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: `p${Date.now()}`,
    };
    const updated = [...products, newProduct];
    return saveProducts(updated);
  };

  const updateProduct = (id, updates) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    return saveProducts(updated);
  };

  const deleteProduct = (id) => {
    const updated = products.filter((p) => p.id !== id);
    return saveProducts(updated);
  };

  const resetProducts = () => {
    return saveProducts(defaultProducts);
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
    refreshProducts: loadProducts,
  };
}
