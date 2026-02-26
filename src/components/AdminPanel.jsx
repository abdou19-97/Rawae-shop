import React, { useState } from "react";
import { useProductContext } from "../contexts/ProductContext";
import ProductForm from "./ProductForm";
import CategoryManager from "./CategoryManager";

export default function AdminPanel({ onLogout }) {
  const { products, addProduct, updateProduct, deleteProduct } =
    useProductContext();

  const [view, setView] = useState("list"); // 'list', 'add', 'edit', 'categories'
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false); // NEW: loading state

  const handleLogout = () => {
    localStorage.removeItem("rawae_admin_auth");
    onLogout();
  };

  // Add this function in AdminPanel.jsx after handleDeleteProduct:

  const testFirebaseConnection = async () => {
    console.log("🧪 === FIREBASE CONNECTION TEST ===");

    try {
      // Check environment variables
      console.log("1️⃣ Environment Variables:");
      console.log(
        "  API Key:",
        import.meta.env.VITE_FIREBASE_API_KEY ? "✅ Set" : "❌ Missing",
      );
      console.log(
        "  Project ID:",
        import.meta.env.VITE_FIREBASE_PROJECT_ID || "❌ Missing",
      );
      console.log(
        "  Auth Domain:",
        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "❌ Missing",
      );

      // Check database instance
      console.log("2️⃣ Database Instance:");
      const { db } = await import("../firebase/config");
      console.log("  Database:", db ? "✅ Initialized" : "❌ Not initialized");
      console.log("  Database type:", db?.type || "unknown");

      // Try to read from Firestore
      console.log("3️⃣ Testing READ access...");
      const { collection, getDocs } = await import("firebase/firestore");
      const snapshot = await getDocs(collection(db, "products"));
      console.log("  ✅ READ successful! Found", snapshot.size, "products");

      // Try to write to Firestore
      console.log("4️⃣ Testing WRITE access...");
      const { addDoc, deleteDoc, doc } = await import("firebase/firestore");

      const testData = {
        test: true,
        timestamp: new Date().toISOString(),
        name: "Test Product - DELETE ME",
      };

      const docRef = await addDoc(collection(db, "products"), testData);
      console.log("  ✅ WRITE successful! Doc ID:", docRef.id);

      // Clean up test document
      console.log("5️⃣ Cleaning up test document...");
      await deleteDoc(doc(db, "products", docRef.id));
      console.log("  ✅ Cleanup successful!");

      alert(
        "✅ All Firebase tests passed!\n\nFirestore is working correctly.\n\nCheck console for details.",
      );
    } catch (error) {
      console.error("❌ Firebase test failed:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);

      let diagnosis = "❌ Firebase Connection Test Failed\n\n";

      if (error.code === "permission-denied") {
        diagnosis +=
          "🚫 PERMISSION DENIED\n\nFirestore security rules are blocking access.\n\nFix:\n1. Go to Firebase Console\n2. Select your project\n3. Firestore Database → Rules\n4. Change to: allow read, write: if true;\n5. Click Publish";
      } else if (error.message.includes("timeout")) {
        diagnosis +=
          "⏱️ CONNECTION TIMEOUT\n\nCannot reach Firebase servers.\n\nCheck:\n1. Internet connection\n2. Firewall settings\n3. Firebase project status";
      } else {
        diagnosis += `Error: ${error.message}\nCode: ${error.code || "unknown"}`;
      }

      alert(diagnosis);
    }

    console.log("🏁 === TEST COMPLETE ===");
  };

  // FIXED: now async so Firestore write actually completes
  // FIXED: now async so Firestore write actually completes
  const handleAddProduct = async (productData) => {
    console.log("handleAddProduct called with:", productData);
    setSaving(true);
    try {
      console.log("Calling addProduct...");
      const success = await addProduct(productData);
      console.log("addProduct returned:", success);

      if (success) {
        setView("list");
        alert("Product added successfully!");
      } else {
        alert("Error adding product. Please try again.");
      }
    } catch (err) {
      console.error("Error in handleAddProduct:", err);
      alert("Error adding product: " + err.message);
    } finally {
      console.log("Setting saving to false");
      setSaving(false);
    }
  };

  // FIXED: now async
  const handleUpdateProduct = async (productData) => {
    setSaving(true);
    try {
      const success = await updateProduct(editingProduct.id, productData);
      if (success) {
        setView("list");
        setEditingProduct(null);
        alert("Product updated successfully!");
      } else {
        alert("Error updating product. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating product: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // FIXED: now async
  const handleDeleteProduct = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setSaving(true);
      try {
        const success = await deleteProduct(id);
        if (success) {
          alert("Product deleted successfully!");
        } else {
          alert("Error deleting product. Please try again.");
        }
      } catch (err) {
        console.error(err);
        alert("Error deleting product: " + err.message);
      } finally {
        setSaving(false);
      }
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.inStock).length,
    discounted: products.filter((p) => p.discount > 0).length,
    featured: products.filter((p) => p.isFeatured).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-sm text-gray-600">Rawae Cosmatics</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Saving overlay */}
      {saving && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white px-8 py-6 rounded-lg shadow-xl text-center">
            <div className="text-2xl mb-2">⏳</div>
            <p className="text-gray-700 font-medium">Saving to database...</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {view === "categories" ? (
          <CategoryManager onBack={() => setView("list")} />
        ) : view === "list" ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-pink-600">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-600">Total Products</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-green-600">
                  {stats.inStock}
                </div>
                <div className="text-sm text-gray-600">In Stock</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.discounted}
                </div>
                <div className="text-sm text-gray-600">On Sale</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.featured}
                </div>
                <div className="text-sm text-gray-600">Featured</div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setView("add")}
                  className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  + Add Product
                </button>
                <button
                  onClick={() => setView("categories")}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  📁 Manage Categories
                </button>
                <button
                  onClick={testFirebaseConnection}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  🧪 Test Firebase
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Product List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Image
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Discount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <img
                            src={product.images?.[0]}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.brand}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {product.category}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {product.basePrice} MRO
                        </td>
                        <td className="px-4 py-3">
                          {product.discount > 0 && (
                            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded">
                              -{product.discount}%
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {product.inStock ? (
                              <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded">
                                In Stock
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded">
                                Out
                              </span>
                            )}
                            {product.isNew && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                                New
                              </span>
                            )}
                            {product.isFeatured && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded">
                                Featured
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setView("edit");
                              }}
                              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">
              {view === "add" ? "Add New Product" : "Edit Product"}
            </h2>
            <ProductForm
              product={editingProduct}
              onSave={view === "add" ? handleAddProduct : handleUpdateProduct}
              onCancel={() => {
                setView("list");
                setEditingProduct(null);
              }}
              saving={saving}
            />
          </div>
        )}
      </div>
    </div>
  );
}
