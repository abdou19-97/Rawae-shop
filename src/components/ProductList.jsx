import React, { useMemo, useState } from "react";
import { useProductContext } from "../contexts/ProductContext";
import ProductCard from "./ProductCard";
import { categories } from "../data/categories";

export default function ProductList({
  onAdd,
  onQuickView,
  onRegisterInterest,
  categoryId,
  subcategoryId,
  lang = "en",
}) {
  const { products } = useProductContext();
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const t = {
    en: {
      search: "Search products...",
      default: "Default",
      priceLow: "Price: Low to High",
      priceHigh: "Price: High to Low",
      name: "Name",
      noProducts: "No products found",
    },
    ar: {
      search: "بحث...",
      default: "الترتيب الافتراضي",
      priceLow: "السعر: من الأقل",
      priceHigh: "السعر: من الأعلى",
      name: "الاسم",
      noProducts: "لا توجد منتجات",
    },
    fr: {
      search: "Rechercher des produits...",
      default: "Par défaut",
      priceLow: "Prix: Croissant",
      priceHigh: "Prix: Décroissant",
      name: "Nom",
      noProducts: "Aucun produit trouvé",
    },
  };

  const getCategoryName = (cat) => {
    if (lang === "ar") return cat.nameAr;
    if (lang === "fr") return cat.nameFr || cat.name;
    return cat.name;
  };

  const getSubcategoryName = (subcat) => {
    if (lang === "ar") return subcat.nameAr;
    if (lang === "fr") return subcat.nameFr || subcat.name;
    return subcat.name;
  };

  let filtered = products;

  if (subcategoryId) {
    filtered = filtered.filter((p) => p.subcategory === subcategoryId);
  } else if (categoryId) {
    filtered = filtered.filter((p) => p.category === categoryId);
  }

  filtered = filtered.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );

  // Sorting
  if (sortBy === "price-low") {
    filtered = [...filtered].sort((a, b) => a.basePrice - b.basePrice);
  } else if (sortBy === "price-high") {
    filtered = [...filtered].sort((a, b) => b.basePrice - a.basePrice);
  } else if (sortBy === "name") {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }

  const getBreadcrumb = () => {
    if (!categoryId) return null;
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return null;

    let breadcrumb = getCategoryName(cat);
    if (subcategoryId) {
      const subcat = cat.subcategories.find((s) => s.id === subcategoryId);
      if (subcat) {
        breadcrumb += ` > ${getSubcategoryName(subcat)}`;
      }
    }
    return breadcrumb;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {getBreadcrumb() && (
        <div className="text-sm text-gray-600 mb-4">{getBreadcrumb()}</div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t[lang].search}
          className="flex-1 px-3 py-2 border rounded"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="default">{t[lang].default}</option>
          <option value="price-low">{t[lang].priceLow}</option>
          <option value="price-high">{t[lang].priceHigh}</option>
          <option value="name">{t[lang].name}</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <ProductCard
            key={p.id}
            p={p}
            onAdd={onAdd}
            onQuickView={onQuickView}
            onRegisterInterest={onRegisterInterest}
            lang={lang}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {t[lang].noProducts}
        </div>
      )}
    </div>
  );
}
