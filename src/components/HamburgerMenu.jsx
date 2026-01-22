import React from "react";
import { useProductContext } from "../contexts/ProductContext";

export default function HamburgerMenu({
  open,
  onClose,
  onNavigate,
  lang = "en",
}) {
  const { categories } = useProductContext();

  const getCategoryName = (cat) => {
    if (lang === "ar") return cat.nameAr;
    if (lang === "fr") return cat.nameFr || cat.name;
    return cat.name;
  };

  const t = {
    en: { categories: "Categories" },
    ar: { categories: "التصنيفات" },
    fr: { categories: "Catégories" },
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}></div>
      <div
        className={`fixed top-0 ${
          lang === "ar" ? "right-0" : "left-0"
        } h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          open
            ? "translate-x-0"
            : lang === "ar"
            ? "translate-x-full"
            : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold text-pink-600">
            {t[lang].categories}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-600 hover:text-gray-800"
          >
            ×
          </button>
        </div>

        <nav className="overflow-y-auto h-[calc(100vh-70px)]">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onNavigate("category", cat.id);
                onClose();
              }}
              className="w-full px-4 py-4 border-b flex items-center gap-3 hover:bg-pink-50 transition-colors"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="flex-1 text-left font-medium">
                {getCategoryName(cat)}
              </span>
              <span className="text-gray-400">›</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
