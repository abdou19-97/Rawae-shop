import React, { useState } from "react";
import { useCategories } from "../hooks/useCategories";

export default function ProductForm({ product, onSave, onCancel }) {
  const { categories, addCategory, addSubcategory } = useCategories();
  const [formData, setFormData] = useState(
    product || {
      name: "",
      brand: "",
      description: "",
      features: [""],
      category: "",
      subcategory: "",
      basePrice: 0,
      discount: 0,
      soldCount: 0,
      isNew: false,
      isFeatured: false,
      images: [""],
      gift: { name: "", image: "" },
      inStock: true,
    },
  );

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubcategory, setShowAddSubcategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [uploading, setUploading] = useState(false);

  const selectedCategory = categories.find((c) => c.id === formData.category);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const categoryId = newCategoryName.toLowerCase().replace(/\s+/g, "-");
    const newCat = {
      id: categoryId,
      name: newCategoryName,
      nameAr: newCategoryName,
      nameFr: newCategoryName,
      icon: "✨",
      subcategories: [],
    };

    if (addCategory(newCat)) {
      setFormData((prev) => ({
        ...prev,
        category: categoryId,
        subcategory: "",
      }));
      setNewCategoryName("");
      setShowAddCategory(false);
      alert("Category added successfully!");
    }
  };

  const handleAddSubcategory = () => {
    if (!newSubcategoryName.trim() || !formData.category) return;

    const subcategoryId = newSubcategoryName.toLowerCase().replace(/\s+/g, "-");
    const newSub = {
      id: subcategoryId,
      name: newSubcategoryName,
      nameAr: newSubcategoryName,
      nameFr: newSubcategoryName,
      image: "https://images.unsplash.com/photo-1556228578-dd26e4254f4a?w=400",
    };

    if (addSubcategory(formData.category, newSub)) {
      setFormData((prev) => ({ ...prev, subcategory: subcategoryId }));
      setNewSubcategoryName("");
      setShowAddSubcategory(false);
      alert("Subcategory added successfully!");
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10MB");
      return;
    }

    setUploading(true);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("Cloudinary not configured. Please check your .env file.");
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, images: [data.secure_url] }));
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate ID if new product
    const productData = {
      ...formData,
      id: product?.id || `p${Date.now()}`,
    };

    onSave(productData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand *
          </label>
          <input
            type="text"
            value={formData.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <div className="flex gap-2">
            <select
              value={formData.category}
              onChange={(e) => {
                handleChange("category", e.target.value);
                handleChange("subcategory", "");
              }}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              title="Add new category"
            >
              +
            </button>
          </div>
          {showAddCategory && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddCategory(false);
                  setNewCategoryName("");
                }}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Subcategory */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subcategory *
          </label>
          <div className="flex gap-2">
            <select
              value={formData.subcategory}
              onChange={(e) => handleChange("subcategory", e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              required
              disabled={!formData.category}
            >
              <option value="">Select subcategory</option>
              {selectedCategory?.subcategories?.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowAddSubcategory(!showAddSubcategory)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              disabled={!formData.category}
              title="Add new subcategory"
            >
              +
            </button>
          </div>
          {showAddSubcategory && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                placeholder="New subcategory name"
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <button
                type="button"
                onClick={handleAddSubcategory}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddSubcategory(false);
                  setNewSubcategoryName("");
                }}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-sm"
              >
                Cancel
              </button>
            </div>
          )}
          {!formData.category && (
            <p className="text-xs text-gray-500 mt-1">
              Select a category first
            </p>
          )}
        </div>

        {/* Base Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Base Price (MRO) *
          </label>
          <input
            type="number"
            value={formData.basePrice}
            onChange={(e) => handleChange("basePrice", Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
            required
            min="0"
          />
        </div>

        {/* Discount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discount (%)
          </label>
          <input
            type="number"
            value={formData.discount}
            onChange={(e) => handleChange("discount", Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
            min="0"
            max="100"
          />
        </div>

        {/* Sold Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sold Count
          </label>
          <input
            type="number"
            value={formData.soldCount}
            onChange={(e) => handleChange("soldCount", Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
            min="0"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
          rows="3"
          required
        />
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Features
        </label>
        {formData.features.map((feature, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={feature}
              onChange={(e) => handleFeatureChange(index, e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              placeholder="Enter feature"
            />
            {formData.features.length > 1 && (
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addFeature}
          className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          + Add Feature
        </button>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full px-4 py-2 border rounded-lg"
          disabled={uploading}
        />
        {uploading && (
          <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
        )}
        {formData.images[0] && !uploading && (
          <img
            src={formData.images[0]}
            alt="Preview"
            className="mt-2 h-32 object-cover rounded"
          />
        )}
        <p className="text-xs text-gray-500 mt-1">Or enter image URL:</p>
        <input
          type="url"
          value={formData.images[0]}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, images: [e.target.value] }))
          }
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 mt-1"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Gift */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gift Name
          </label>
          <input
            type="text"
            value={formData.gift.name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                gift: { ...prev.gift, name: e.target.value },
              }))
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gift Image URL
          </label>
          <input
            type="url"
            value={formData.gift.image}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                gift: { ...prev.gift, image: e.target.value },
              }))
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.inStock}
            onChange={(e) => handleChange("inStock", e.target.checked)}
            className="w-5 h-5 text-pink-600"
          />
          <span className="text-sm font-medium">In Stock</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isNew}
            onChange={(e) => handleChange("isNew", e.target.checked)}
            className="w-5 h-5 text-pink-600"
          />
          <span className="text-sm font-medium">New Product</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => handleChange("isFeatured", e.target.checked)}
            className="w-5 h-5 text-pink-600"
          />
          <span className="text-sm font-medium">Featured</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t">
        <button
          type="submit"
          className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700"
          disabled={uploading}
        >
          {product ? "Update Product" : "Add Product"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
