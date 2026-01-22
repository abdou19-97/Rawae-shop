import React, { useState } from "react";
import { useProductContext } from "../contexts/ProductContext";
import { useCategories } from "../hooks/useCategories";
import ProductForm from "./ProductForm";

export default function AdminPanel({ onLogout }) {
  const { products, addProduct, updateProduct, deleteProduct, resetProducts } =
    useProductContext();

  const { categories, deleteCategory, deleteSubcategory } = useCategories();

  const [view, setView] = useState("list"); // 'list', 'add', 'edit', 'categories'
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("rawae_admin_auth");
    onLogout();
  };

  const handleAddProduct = (productData) => {
    if (addProduct(productData)) {
      setView("list");
      alert("Product added successfully!");
    } else {
      alert("Error adding product");
    }
  };

  const handleUpdateProduct = (productData) => {
    if (updateProduct(editingProduct.id, productData)) {
      setView("list");
      setEditingProduct(null);
      alert("Product updated successfully!");
    } else {
      alert("Error updating product");
    }
  };

  const handleDeleteProduct = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      if (deleteProduct(id)) {
        alert("Product deleted successfully!");
      } else {
        alert("Error deleting product");
      }
    }
  };

  const handleDeleteCategory = (categoryId) => {
    const hasProducts = products.some((p) => p.category === categoryId);
    if (hasProducts) {
      alert(
        "Cannot delete category - it has products. Delete the products first."
      );
      return;
    }
    if (confirm("Are you sure you want to delete this category?")) {
      if (deleteCategory(categoryId)) {
        alert("Category deleted successfully!");
      }
    }
  };

  const handleDeleteSubcategory = (categoryId, subcategoryId) => {
    const hasProducts = products.some((p) => p.subcategory === subcategoryId);
    if (hasProducts) {
      alert(
        "Cannot delete subcategory - it has products. Delete the products first."
      );
      return;
    }
    if (confirm("Are you sure you want to delete this subcategory?")) {
      if (deleteSubcategory(categoryId, subcategoryId)) {
        alert("Subcategory deleted successfully!");
      }
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
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

      <div className="max-w-7xl mx-auto px-4 py-6">
        {view === "list" ? (
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
                            src={product.images[0]}
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
        ) : view === "categories" ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Manage Categories</h2>
              <button
                onClick={() => setView("list")}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                ← Back to Products
              </button>
            </div>

            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ID: {category.id}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete Category
                    </button>
                  </div>

                  <div className="ml-11 space-y-2">
                    <h4 className="font-medium text-sm text-gray-700">
                      Subcategories:
                    </h4>
                    {category.subcategories &&
                    category.subcategories.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {category.subcategories.map((sub) => (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded"
                          >
                            <span className="text-sm">{sub.name}</span>
                            <button
                              onClick={() =>
                                handleDeleteSubcategory(category.id, sub.id)
                              }
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        No subcategories yet
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-500 mt-6">
              💡 Tip: Add new categories and subcategories directly when
              creating/editing products using the + button.
            </p>
          </div>
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
            />
          </div>
        )}
      </div>
    </div>
  );
}
