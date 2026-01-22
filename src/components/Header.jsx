import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";

export default function Header({ onOpenCart, onOpenMenu, lang, setLang }) {
  const { items } = useCart();
  const qty = items.reduce((s, i) => s + i.qty, 0);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "ar", name: "العربية", flag: "🇲🇷" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
  ];

  const currentLang = languages.find((l) => l.code === lang);

  const t = {
    en: { cart: "Cart" },
    ar: { cart: "السلة" },
    fr: { cart: "Panier" },
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenMenu}
            className="text-2xl hover:text-pink-600 transition-colors"
            aria-label="Menu"
          >
            ☰
          </button>
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="Rawae.Co - Beauty · Skincare · Wellness"
              className="h-12 w-auto object-contain"
              onError={(e) => {
                // Fallback if image doesn't exist
                e.target.style.display = "none";
                e.target.nextElementSibling.style.display = "block";
              }}
            />
            <span
              className="text-2xl font-semibold text-pink-600"
              style={{ display: "none" }}
            >
              Rawae.Co
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              className="flex items-center gap-1 px-3 py-1 text-sm border rounded hover:bg-gray-50"
              onClick={() => setShowLangMenu(!showLangMenu)}
            >
              <span className="text-lg">{currentLang?.flag}</span>
              <span>{currentLang?.code.toUpperCase()}</span>
              <span className="text-xs">▾</span>
            </button>
            {showLangMenu && (
              <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg py-1 min-w-[120px] z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setShowLangMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-pink-50 flex items-center gap-2"
                  >
                    <span>{l.flag}</span>
                    <span className="text-sm">{l.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={onOpenCart}
            className="relative px-3 py-2 bg-pink-100 rounded-md hover:bg-pink-200"
          >
            🛒 {t[lang].cart}
            {qty > 0 && (
              <span className="ml-2 inline-block bg-pink-600 text-white px-2 text-xs rounded-full">
                {qty}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
