import React, { useState } from "react";

export default function ProductCard({
  p,
  onAdd,
  onQuickView,
  onRegisterInterest,
  lang = "en",
  showDiscount = false,
}) {
  const [wishlisted, setWishlisted] = useState(false);

  const toggleWishlist = () => {
    setWishlisted(!wishlisted);
    const list = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (!wishlisted) {
      list.push(p.id);
    } else {
      const idx = list.indexOf(p.id);
      if (idx > -1) list.splice(idx, 1);
    }
    localStorage.setItem("wishlist", JSON.stringify(list));
  };

  const finalPrice =
    p.discount > 0
      ? Math.round(p.basePrice * (1 - p.discount / 100))
      : p.basePrice;
  const hasDiscount = p.discount > 0;

  const t = {
    en: {
      outOfStock: "Out of Stock",
      gift: "Gift",
      add: "Add",
      notify: "Notify",
      quick: "Quick",
    },
    ar: {
      outOfStock: "نفذ",
      gift: "هدية",
      add: "أضف",
      notify: "أبلغني",
      quick: "معاينة",
    },
    fr: {
      outOfStock: "Rupture",
      gift: "Cadeau",
      add: "Ajouter",
      notify: "Notifier",
      quick: "Rapide",
    },
  };

  return (
    <div className="border rounded-lg p-3 bg-white hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={p.images[0]}
          alt={p.name}
          className="w-full h-44 object-cover rounded-md"
        />
        {!p.inStock && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
            {t[lang].outOfStock}
          </div>
        )}
        {hasDiscount && showDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
            -{p.discount}%
          </div>
        )}
        {p.isNew && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 text-xs font-bold rounded">
            {lang === "ar" ? "جديد" : lang === "fr" ? "Nouveau" : "NEW"}
          </div>
        )}
        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-pink-50"
        >
          <span className={wishlisted ? "text-red-500" : "text-gray-400"}>
            ♥
          </span>
        </button>
        <div className="absolute bottom-2 right-2 bg-pink-100 text-pink-600 px-2 py-1 text-xs rounded">
          {t[lang].gift}
        </div>
      </div>
      <div className="mt-2">
        <div className="text-xs text-gray-500">{p.brand}</div>
        <h3 className="font-medium">{p.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <div className="text-pink-600 font-semibold">{finalPrice} MRO</div>
          {hasDiscount && (
            <div className="text-xs text-gray-400 line-through">
              {p.basePrice} MRO
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            className="text-sm bg-pink-600 text-white px-3 py-1 rounded hover:bg-pink-700 disabled:bg-gray-300"
            onClick={() => onAdd(p.id)}
            disabled={!p.inStock}
          >
            {t[lang].add}
          </button>
          {!p.inStock ? (
            <button
              className="text-sm border px-3 py-1 rounded hover:bg-gray-50"
              onClick={() => onRegisterInterest(p.id)}
            >
              {t[lang].notify}
            </button>
          ) : (
            <button
              className="text-sm border px-3 py-1 rounded hover:bg-gray-50"
              onClick={() => onQuickView(p.id)}
            >
              {t[lang].quick}
            </button>
          )}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
        <img
          src={p.gift.image}
          alt="gift"
          className="w-8 h-8 object-cover rounded"
        />
        <div>
          {lang === "ar" ? "هدية" : "Gift"}: {p.gift.name}
        </div>
      </div>
    </div>
  );
}
