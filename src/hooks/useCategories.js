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
import { categories as initialCategories } from "../data/categories";

const COLLECTION_NAME = "categories";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize Firestore with default categories if empty
  const initializeCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION_NAME));

      if (snapshot.empty) {
        console.log("Initializing categories in Firestore...");
        for (const category of initialCategories) {
          await addDoc(collection(db, COLLECTION_NAME), category);
        }
        console.log("Categories initialized!");
      }
    } catch (error) {
      console.error("Error initializing categories:", error);
    }
  };

  // Real-time listener for categories
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, COLLECTION_NAME),
      (snapshot) => {
        const categoriesData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          firestoreId: doc.id,
        }));
        setCategories(categoriesData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      },
    );

    initializeCategories();

    return () => unsubscribe();
  }, []);

  // Add category
  const addCategory = async (category) => {
    try {
      // Check if category ID already exists
      if (categories.find((c) => c.id === category.id)) {
        alert("Category ID already exists");
        return false;
      }
      await addDoc(collection(db, COLLECTION_NAME), category);
      return true;
    } catch (error) {
      console.error("Error adding category:", error);
      return false;
    }
  };

  // Update category
  const updateCategory = async (categoryId, updates) => {
    try {
      const category = categories.find((c) => c.id === categoryId);
      if (!category?.firestoreId) {
        throw new Error("Category not found");
      }

      const categoryRef = doc(db, COLLECTION_NAME, category.firestoreId);
      await updateDoc(categoryRef, { ...category, ...updates });
      return true;
    } catch (error) {
      console.error("Error updating category:", error);
      return false;
    }
  };

  // Delete category
  const deleteCategory = async (categoryId) => {
    try {
      const category = categories.find((c) => c.id === categoryId);
      if (!category?.firestoreId) {
        throw new Error("Category not found");
      }

      const categoryRef = doc(db, COLLECTION_NAME, category.firestoreId);
      await deleteDoc(categoryRef);
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      return false;
    }
  };

  // Add subcategory
  const addSubcategory = async (categoryId, subcategory) => {
    try {
      const category = categories.find((c) => c.id === categoryId);
      if (!category) {
        throw new Error("Category not found");
      }

      // Check if subcategory already exists
      if (category.subcategories.find((s) => s.id === subcategory.id)) {
        alert("Subcategory ID already exists");
        return false;
      }

      const updatedSubcategories = [...category.subcategories, subcategory];
      await updateCategory(categoryId, {
        subcategories: updatedSubcategories,
      });
      return true;
    } catch (error) {
      console.error("Error adding subcategory:", error);
      return false;
    }
  };

  // Update subcategory
  const updateSubcategory = async (categoryId, subcategoryId, updates) => {
    try {
      const category = categories.find((c) => c.id === categoryId);
      if (!category) {
        throw new Error("Category not found");
      }

      const updatedSubcategories = category.subcategories.map((sub) =>
        sub.id === subcategoryId ? { ...sub, ...updates } : sub,
      );

      await updateCategory(categoryId, {
        subcategories: updatedSubcategories,
      });
      return true;
    } catch (error) {
      console.error("Error updating subcategory:", error);
      return false;
    }
  };

  // Delete subcategory
  const deleteSubcategory = async (categoryId, subcategoryId) => {
    try {
      const category = categories.find((c) => c.id === categoryId);
      if (!category) {
        throw new Error("Category not found");
      }

      const updatedSubcategories = category.subcategories.filter(
        (sub) => sub.id !== subcategoryId,
      );

      await updateCategory(categoryId, {
        subcategories: updatedSubcategories,
      });
      return true;
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      return false;
    }
  };

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
  };
}
