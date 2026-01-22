import React from "react";
import products from "../data/products";

export default function QuickView({ id, onClose, onAdd }) {
  if (!id) return null;
  const p = products.find((x) => x.id === id);
  if (!p) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white max-w-3xl w-full p-4 rounded">
        <div className="flex gap-4">
          <img
            src={p.images[0]}
            alt="img"
            className="w-1/3 object-cover rounded"
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-sm text-gray-600">{p.description}</p>
            <div className="mt-4">
              Price:{" "}
              <span className="font-bold text-pink-600">{p.basePrice} MRU</span>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                className="px-3 py-2 bg-pink-600 text-white rounded"
                onClick={() => {
                  onAdd(p.id);
                  onClose();
                }}
              >
                Add to cart
              </button>
              <button className="px-3 py-2 border rounded" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
