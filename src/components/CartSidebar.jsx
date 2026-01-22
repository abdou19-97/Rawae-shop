import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";

export default function CartSidebar({ open, onClose, lang = "en" }) {
  const { items, updateQty, remove, compute, applyPromo, promo, clear } =
    useCart();
  const [code, setCode] = useState("");

  const { detailed, subtotal, original, totalSavings, cashback, promoAmount } =
    compute();

  function handleApply() {
    const r = applyPromo(code);
    if (!r.ok) alert(r.message);
    else alert("Applied");
  }

  const t = {
    en: {
      title: "Your Order",
      empty: "Cart is empty.",
      unit: "Unit",
      line: "Line",
      remove: "Remove",
      promo: "Promo code",
      apply: "Apply",
      promoApplied: "✓ Promo {code} applied",
      originalTotal: "Original Total",
      promoDiscount: "Promo Discount ({code})",
      subtotal: "Subtotal",
      totalSavings: "Total Savings 🎉",
      cashback: "Cashback for next order:",
      confirmOrder: "Confirm Order",
      continue: "Continue",
      emptyCart: "Your cart is empty",
    },
    ar: {
      title: "طلبك",
      empty: "السلة فارغة.",
      unit: "الوحدة",
      line: "السطر",
      remove: "إزالة",
      promo: "رمز الخصم",
      apply: "تطبيق",
      promoApplied: "✓ تم تطبيق {code}",
      originalTotal: "المجموع الأصلي",
      promoDiscount: "خصم الكود ({code})",
      subtotal: "المجموع الفرعي",
      totalSavings: "إجمالي التوفير 🎉",
      cashback: "استرداد نقدي للطلب القادم:",
      confirmOrder: "تأكيد الطلب",
      continue: "متابعة",
      emptyCart: "سلتك فارغة",
    },
    fr: {
      title: "Votre Commande",
      empty: "Le panier est vide.",
      unit: "Unité",
      line: "Ligne",
      remove: "Supprimer",
      promo: "Code promo",
      apply: "Appliquer",
      promoApplied: "✓ Promo {code} appliquée",
      originalTotal: "Total Original",
      promoDiscount: "Réduction Promo ({code})",
      subtotal: "Sous-total",
      totalSavings: "Économies Totales 🎉",
      cashback: "Cashback pour la prochaine commande:",
      confirmOrder: "Confirmer la Commande",
      continue: "Continuer",
      emptyCart: "Votre panier est vide",
    },
  };

  function handleConfirmOrder() {
    if (detailed.length === 0) {
      alert(t[lang].emptyCart);
      return;
    }

    // Build WhatsApp message
    let message = "🛍️ *New Order from Rawa.co*\n\n";
    message += "*Order Details:*\n";

    detailed.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   Brand: ${item.brand}\n`;
      message += `   Quantity: ${item.qty}\n`;
      message += `   Unit Price: ${item.unit} MRO\n`;
      message += `   Line Total: ${item.line} MRO\n`;
      message += `   Gift: ${item.gift.name}\n\n`;
    });

    message += "─────────────────\n";
    message += `*Original Total:* ${original} MRO\n`;

    if (promoAmount > 0) {
      message += `*Promo Discount:* -${promoAmount} MRO (${promo.code})\n`;
    }

    message += `*Subtotal:* ${subtotal} MRO\n`;
    message += `*Total Savings:* ${totalSavings} MRO 🎉\n`;
    message += `*Cashback for next order:* ${cashback} MRO 💰\n`;
    message += "─────────────────\n\n";
    message += "Please confirm this order and provide delivery details.";

    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const phone = "222123456"; // Replace with your actual WhatsApp business number
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    // Optional: Clear cart after confirming order
    // Uncomment the line below if you want to clear the cart
    // clear();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="w-full md:w-96 bg-white shadow-xl p-4 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{t[lang].title}</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-xl"
          >
            ×
          </button>
        </div>

        <div className="mt-4">
          {detailed.length === 0 && (
            <div className="text-gray-500 text-center py-8">
              {t[lang].empty}
            </div>
          )}
          {detailed.map((it) => (
            <div key={it.id} className="flex items-center gap-3 py-2 border-b">
              <img
                src={it.images[0]}
                alt={it.name}
                className="w-14 h-14 object-cover rounded"
              />
              <div className="flex-1">
                <div className="font-medium text-sm">{it.name}</div>
                <div className="text-xs text-gray-500">{it.brand}</div>
                <div className="text-sm text-gray-500">
                  {t[lang].unit}: {it.unit} MRO
                </div>
                <div className="text-sm text-pink-600 font-semibold">
                  {t[lang].line}: {it.line} MRO
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <input
                  type="number"
                  value={it.qty}
                  onChange={(e) =>
                    updateQty(it.id, Math.max(1, Number(e.target.value)))
                  }
                  className="w-16 border rounded px-2 py-1 text-sm"
                  min="1"
                />
                <button
                  onClick={() => remove(it.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  {t[lang].remove}
                </button>
              </div>
            </div>
          ))}
        </div>

        {detailed.length > 0 && (
          <>
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <input
                  placeholder={t[lang].promo}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded text-sm"
                />
                <button
                  className="px-3 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 text-sm"
                  onClick={handleApply}
                >
                  {t[lang].apply}
                </button>
              </div>
              {promo && (
                <div className="text-sm text-green-600 mt-2">
                  {t[lang].promoApplied.replace("{code}", promo.code)}
                </div>
              )}
            </div>

            <div className="mt-4 border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t[lang].originalTotal}</span>
                <span className="line-through text-gray-500">
                  {original} MRO
                </span>
              </div>

              {promoAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {t[lang].promoDiscount.replace("{code}", promo.code)}
                  </span>
                  <span className="text-green-600">-{promoAmount} MRO</span>
                </div>
              )}

              <div className="flex justify-between font-semibold text-lg">
                <span>{t[lang].subtotal}</span>
                <span className="text-pink-600">{subtotal} MRO</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-medium">
                  {t[lang].totalSavings}
                </span>
                <span className="text-green-600 font-semibold">
                  {totalSavings} MRO
                </span>
              </div>

              <div className="bg-pink-50 p-3 rounded mt-3">
                <div className="text-xs text-gray-600">{t[lang].cashback}</div>
                <div className="text-pink-600 font-bold">{cashback} MRO 💰</div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={handleConfirmOrder}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <span>💬</span>
                <span>{t[lang].confirmOrder}</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {t[lang].continue}
              </button>
            </div>
          </>
        )}
      </div>
      <div className="flex-1 bg-black/50" onClick={onClose}></div>
    </div>
  );
}
