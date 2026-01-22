import React, { useState } from "react";
import { useProductContext } from "../contexts/ProductContext";

export default function ProductDetail({ productId, onClose, onAdd, lang }) {
  const { products } = useProductContext();
  const [qty, setQty] = useState(1);
  if (!productId) return null;

  const p = products.find((x) => x.id === productId);
  if (!p) return null;

  const currentIndex = products.findIndex((x) => x.id === productId);
  const prevProduct = currentIndex > 0 ? products[currentIndex - 1] : null;
  const nextProduct =
    currentIndex < products.length - 1 ? products[currentIndex + 1] : null;

  const relatedProducts = products
    .filter((x) => x.subcategory === p.subcategory && x.id !== p.id)
    .slice(0, 4);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: p.name,
        text: p.description,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white max-w-4xl w-full rounded-lg shadow-xl">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold">{p.brand}</h2>
            <button
              onClick={onClose}
              className="text-2xl text-gray-600 hover:text-gray-800"
            >
              ×
            </button>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full rounded-lg"
                />
                <div className="flex gap-2 mt-4">
                  {prevProduct && (
                    <button
                      onClick={() =>
                        (window.location.hash = `#product-${prevProduct.id}`)
                      }
                      className="flex-1 px-3 py-2 border rounded hover:bg-gray-50"
                    >
                      ‹ {lang === "ar" ? "السابق" : "Previous"}
                    </button>
                  )}
                  {nextProduct && (
                    <button
                      onClick={() =>
                        (window.location.hash = `#product-${nextProduct.id}`)
                      }
                      className="flex-1 px-3 py-2 border rounded hover:bg-gray-50"
                    >
                      {lang === "ar" ? "التالي" : "Next"} ›
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold">{p.name}</h1>
                    <p className="text-gray-600">{p.brand}</p>
                  </div>
                  <button onClick={handleShare} className="text-2xl">
                    🔗
                  </button>
                </div>

                <div className="mb-6">
                  <div className="text-3xl font-bold text-pink-600">
                    {p.basePrice} {lang === "ar" ? "أوقية" : "MRO"}
                  </div>
                  {!p.inStock && (
                    <div className="text-red-500 mt-2">
                      {lang === "ar" ? "نفذ من المخزون" : "Out of Stock"}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">
                    {lang === "ar" ? "الوصف" : "Description"}
                  </h3>
                  <p className="text-gray-700">{p.description}</p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">
                    {lang === "ar" ? "المميزات" : "Features"}
                  </h3>
                  <ul className="space-y-2">
                    {p.features?.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-pink-600">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">
                    {lang === "ar" ? "هدية مجانية" : "Free Gift"}
                  </h3>
                  <div className="flex items-center gap-3">
                    <img
                      src={p.gift.image}
                      alt={p.gift.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <span className="text-gray-700">{p.gift.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <label className="font-semibold">
                    {lang === "ar" ? "الكمية" : "Quantity"}:
                  </label>
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={qty}
                      onChange={(e) =>
                        setQty(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-16 text-center border-x py-2"
                    />
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onAdd(p.id, qty);
                    onClose();
                  }}
                  disabled={!p.inStock}
                  className="w-full px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {lang === "ar" ? "أضف إلى السلة" : "Add to Cart"}
                </button>
              </div>
            </div>

            {relatedProducts.length > 0 && (
              <div className="mt-8 border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">
                  {lang === "ar" ? "منتجات ذات صلة" : "Related Products"}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {relatedProducts.map((rp) => (
                    <button
                      key={rp.id}
                      onClick={() =>
                        (window.location.hash = `#product-${rp.id}`)
                      }
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={rp.images[0]}
                        alt={rp.name}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="p-2">
                        <div className="text-sm font-medium">{rp.name}</div>
                        <div className="text-sm text-pink-600 font-semibold">
                          {rp.basePrice} MRO
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
