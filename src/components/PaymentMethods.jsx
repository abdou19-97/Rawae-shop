import React from "react";

export default function PaymentMethods() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold mb-3">Payment Methods</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Banking App</h3>
              <p className="text-sm text-gray-500">
                Pay through your banking app for secure transfer.
              </p>
            </div>
            <div className="badge">Free Delivery</div>
          </div>
        </div>
        <div className="p-4 border rounded">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Cash on Delivery</h3>
              <p className="text-sm text-gray-500">
                Pay when your order arrives.
              </p>
            </div>
            <div className="text-sm text-gray-700">Delivery fee applies</div>
          </div>
        </div>
      </div>
    </div>
  );
}
