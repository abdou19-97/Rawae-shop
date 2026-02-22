import { useState, useEffect } from "react";
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
import { initialProducts } from "../data/products";

const COLLECTION_NAME = "products";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Initialize Firestore with default products if empty (only once)
  const initializeProducts = async () => {
    if (initialized) return; // Prevent multiple initializations

    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));

      if (snapshot.empty) {
        console.log("Initializing products in Firestore...");
        // Add all initial products
        for (const product of initialProducts) {
          await addDoc(collection(db, COLLECTION_NAME), product);
        }
        console.log("Products initialized!");
      }
      setInitialized(true);
    } catch (error) {
      console.error("Error initializing products:", error);
      setInitialized(true); // Mark as initialized even on error
    }
  };

  // Real-time listener for products
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, COLLECTION_NAME),
      (snapshot) => {
        const productsData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          firestoreId: doc.id, // Store Firestore document ID
        }));
        setProducts(productsData);
        setLoading(false);

        // Initialize only after first snapshot and only once
        if (!initialized) {
          initializeProducts();
        }
      },
      (error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [initialized]); // Add initialized as dependency

  // Add product
  const addProduct = async (product) => {
    try {
      await addDoc(collection(db, COLLECTION_NAME), product);
      return true;
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Check console for details.");
      return false;
    }
  };

  // Update product
  const updateProduct = async (productId, updates) => {
    try {
      // Find the Firestore document ID
      const product = products.find((p) => p.id === productId);
      if (!product?.firestoreId) {
        throw new Error("Product not found");
      }

      const productRef = doc(db, COLLECTION_NAME, product.firestoreId);
      await updateDoc(productRef, updates);
      return true;
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Check console for details.");
      return false;
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (!product?.firestoreId) {
        throw new Error("Product not found");
      }

      const productRef = doc(db, COLLECTION_NAME, product.firestoreId);
      await deleteDoc(productRef);
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Check console for details.");
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
