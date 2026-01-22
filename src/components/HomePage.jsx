import React from "react";
import { useProductContext } from "../contexts/ProductContext";
import ProductCard from "./ProductCard";

export default function HomePage({
  onAdd,
  onQuickView,
  onRegisterInterest,
  lang = "en",
}) {
  const { products } = useProductContext();

  const t = {
    en: {
      specialOffers: "Special Offers",
      viewAll: "View All",
      bestSellers: "Best Sellers",
      newArrivals: "New Arrivals",
      featured: "Featured Products",
      save: "Save",
    },
    ar: {
      specialOffers: "عروض خاصة",
      viewAll: "عرض الكل",
      bestSellers: "الأكثر مبيعاً",
      newArrivals: "وصل حديثاً",
      featured: "منتجات مميزة",
      save: "وفر",
    },
    fr: {
      specialOffers: "Offres Spéciales",
      viewAll: "Voir Tout",
      bestSellers: "Meilleures Ventes",
      newArrivals: "Nouveautés",
      featured: "Produits en Vedette",
      save: "Économisez",
    },
  };

  // Filter products by different criteria
  const discountedProducts = products.filter((p) => p.discount > 0).slice(0, 8);
  const bestSellers = products
    .filter((p) => p.soldCount > 50)
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 8);
  const newProducts = products.filter((p) => p.isNew).slice(0, 8);
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);

  const ProductSection = ({ title, products, showDiscount = false }) => {
    if (products.length === 0) return null;

    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button className="text-pink-600 hover:underline text-sm font-medium">
            {t[lang].viewAll} →
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              onAdd={onAdd}
              onQuickView={onQuickView}
              onRegisterInterest={onRegisterInterest}
              lang={lang}
              showDiscount={showDiscount}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Hero Banner */}
      <div className="mb-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          {lang === "ar"
            ? "اكتشفي جمالك"
            : lang === "fr"
            ? "Découvrez Votre Beauté"
            : "Discover Your Beauty"}
        </h1>
        <p className="text-lg md:text-xl mb-6 opacity-90">
          {lang === "ar"
            ? "منتجات عناية فاخرة بأسعار رائعة"
            : lang === "fr"
            ? "Produits de beauté de luxe à prix incroyables"
            : "Premium beauty products at amazing prices"}
        </p>
        <button className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
          {lang === "ar"
            ? "تسوق الآن"
            : lang === "fr"
            ? "Acheter Maintenant"
            : "Shop Now"}
        </button>
      </div>

      {/* Special Offers Section */}
      {discountedProducts.length > 0 && (
        <ProductSection
          title={`🔥 ${t[lang].specialOffers}`}
          products={discountedProducts}
          showDiscount={true}
        />
      )}

      {/* Best Sellers Section */}
      {bestSellers.length > 0 && (
        <ProductSection
          title={`⭐ ${t[lang].bestSellers}`}
          products={bestSellers}
        />
      )}

      {/* New Arrivals Section */}
      {newProducts.length > 0 && (
        <ProductSection
          title={`✨ ${t[lang].newArrivals}`}
          products={newProducts}
        />
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <ProductSection
          title={`💎 ${t[lang].featured}`}
          products={featuredProducts}
        />
      )}

      {/* Category Quick Links */}
      <div className="mt-12 bg-gray-50 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          {lang === "ar"
            ? "تسوق حسب الفئة"
            : lang === "fr"
            ? "Acheter par Catégorie"
            : "Shop by Category"}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              id: "skincare",
              icon: "🧴",
              name: {
                en: "Skincare",
                ar: "العناية بالبشرة",
                fr: "Soins de la Peau",
              },
            },
            {
              id: "makeup",
              icon: "💄",
              name: { en: "Makeup", ar: "مكياج", fr: "Maquillage" },
            },
            {
              id: "haircare",
              icon: "💆",
              name: {
                en: "Hair Care",
                ar: "العناية بالشعر",
                fr: "Soins Capillaires",
              },
            },
            {
              id: "sunscreen",
              icon: "☀️",
              name: {
                en: "Sunscreen",
                ar: "واقي شمس",
                fr: "Protection Solaire",
              },
            },
          ].map((cat) => (
            <button
              key={cat.id}
              className="bg-white rounded-lg p-4 text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-2">{cat.icon}</div>
              <div className="font-medium text-gray-700">{cat.name[lang]}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
