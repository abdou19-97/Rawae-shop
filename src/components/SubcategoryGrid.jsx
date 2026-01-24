import React from "react";
import { useProductContext } from "../contexts/ProductContext";

export default function SubcategoryGrid({
  categoryId,
  onNavigate,
  lang = "en",
}) {
  const { categories, products } = useProductContext();
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return <div>Category not found</div>;

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

  const getProductCount = (subcatId) =>
    products.filter((p) => p.subcategory === subcatId).length;

  const t = {
    en: { products: "products" },
    ar: { products: "منتج" },
    fr: { products: "produits" },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">{getCategoryName(category)}</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {category.subcategories.map((subcat) => {
          const count = getProductCount(subcat.id);
          return (
            <button
              key={subcat.id}
              onClick={() => onNavigate("subcategory", categoryId, subcat.id)}
              className="group border rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={subcat.image}
                  alt={subcat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium">{getSubcategoryName(subcat)}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {count} {t[lang].products}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
