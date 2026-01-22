import { useState, useEffect } from "react";
import { categories as defaultCategories } from "../data/categories";

const STORAGE_KEY = "rawae_categories";

export function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCategories(JSON.parse(stored));
      } else {
        setCategories(defaultCategories);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCategories));
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      setCategories(defaultCategories);
    }
  };

  const saveCategories = (newCategories) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCategories));
      setCategories(newCategories);
      return true;
    } catch (error) {
      console.error("Error saving categories:", error);
      return false;
    }
  };

  const addCategory = (categoryData) => {
    const newCategory = {
      ...categoryData,
      id: categoryData.id || `cat${Date.now()}`,
      subcategories: categoryData.subcategories || [],
    };
    const updated = [...categories, newCategory];
    return saveCategories(updated);
  };

  const updateCategory = (id, updates) => {
    const updated = categories.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    );
    return saveCategories(updated);
  };

  const deleteCategory = (id) => {
    const updated = categories.filter((c) => c.id !== id);
    return saveCategories(updated);
  };

  const addSubcategory = (categoryId, subcategoryData) => {
    const updated = categories.map((cat) => {
      if (cat.id === categoryId) {
        const newSubcategory = {
          ...subcategoryData,
          id: subcategoryData.id || `sub${Date.now()}`,
        };
        return {
          ...cat,
          subcategories: [...(cat.subcategories || []), newSubcategory],
        };
      }
      return cat;
    });
    return saveCategories(updated);
  };

  const updateSubcategory = (categoryId, subcategoryId, updates) => {
    const updated = categories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subcategories: cat.subcategories.map((sub) =>
            sub.id === subcategoryId ? { ...sub, ...updates } : sub
          ),
        };
      }
      return cat;
    });
    return saveCategories(updated);
  };

  const deleteSubcategory = (categoryId, subcategoryId) => {
    const updated = categories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          subcategories: cat.subcategories.filter(
            (sub) => sub.id !== subcategoryId
          ),
        };
      }
      return cat;
    });
    return saveCategories(updated);
  };

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    refreshCategories: loadCategories,
  };
}
