import { useState, useEffect, useRef } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";
// import { initialProducts } from "../data/products";

const COLLECTION_NAME = "products";

// Wraps a promise with a timeout so it never hangs forever
function withTimeout(promise, ms = 10000) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Firestore timeout after ${ms}ms`)), ms),
  );
  return Promise.race([promise, timeout]);
}

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false); // Use ref instead of state to avoid stale closures

  // Initialize Firestore with default products if empty (only once)
  // const initializeProducts = async () => {
  //   if (initializedRef.current) return;
  //   initializedRef.current = true; // Set immediately to prevent race conditions

  //   try {
  //     const snapshot = await withTimeout(
  //       getDocs(collection(db, COLLECTION_NAME)),
  //     );

  //     if (snapshot.empty) {
  //       for (const product of initialProducts) {
  //         await withTimeout(addDoc(collection(db, COLLECTION_NAME), product));
  //       }
  //     } else {
  //       console.log(`✅ Found ${snapshot.size} existing products`);
  //     }
  //   } catch (error) {
  //     console.error("Error initializing products:", error);
  //   }
  // };

  // Real-time listener for products
  useEffect(() => {
    let firstSnapshot = true;

    const unsubscribe = onSnapshot(
      collection(db, COLLECTION_NAME),
      (snapshot) => {
        const productsData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          firestoreId: doc.id,
        }));
        setProducts(productsData);
        setLoading(false);

        // Only initialize on the very first snapshot
        if (firstSnapshot) {
          firstSnapshot = false;
          initializeProducts();
        }
      },
      (error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []); // Empty dependency array — only run once on mount

  // Add product
  const addProduct = async (product) => {
    try {
      await withTimeout(addDoc(collection(db, COLLECTION_NAME), product));
      console.log("addProduct: success!");
      return true;
    } catch (error) {
      console.error("Error adding product:", error);
      alert(`Failed to add product: ${error.message}`);
      return false;
    }
  };

  // Update product
  const updateProduct = async (productId, updates) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (!product?.firestoreId) {
        throw new Error("Product not found in local state");
      }
      const productRef = doc(db, COLLECTION_NAME, product.firestoreId);
      await withTimeout(updateDoc(productRef, updates));
      return true;
    } catch (error) {
      console.error("Error updating product:", error);
      alert(`Failed to update product: ${error.message}`);
      return false;
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (!product?.firestoreId) {
        throw new Error("Product not found in local state");
      }
      const productRef = doc(db, COLLECTION_NAME, product.firestoreId);
      await withTimeout(deleteDoc(productRef));
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(`Failed to delete product: ${error.message}`);
      return false;
    }
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
