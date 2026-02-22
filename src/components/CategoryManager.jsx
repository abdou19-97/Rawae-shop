import React, { useState } from "react";
import { useProductContext } from "../contexts/ProductContext";

export default function CategoryManager({ onBack }) {
  const {
    categories,
    updateCategory,
    addCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
  } = useProductContext();
  const { products } = useProductContext();

  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubcategory, setShowAddSubcategory] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    nameAr: "",
    nameFr: "",
    icon: "✨",
  });

  const [subcategoryForm, setSubcategoryForm] = useState({
    name: "",
    nameAr: "",
    nameFr: "",
    image: "",
  });

  // Upload to Cloudinary
  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary not configured");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

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
    return data.secure_url;
  };

  const handleImageUpload = async (
    e,
    type,
    categoryId = null,
    subId = null,
  ) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10MB");
      return;
    }

    setUploading(true);

    try {
      const imageUrl = await uploadToCloudinary(file);

      if (type === "subcategory" && categoryId && subId) {
        handleUpdateSubcategoryImage(categoryId, subId, imageUrl);
        alert("Subcategory image updated!");
      } else if (type === "subcategory") {
        setSubcategoryForm((prev) => ({ ...prev, image: imageUrl }));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateCategoryImage = (categoryId, field, value) => {
    updateCategory(categoryId, { [field]: value });
  };

  const handleUpdateSubcategoryImage = (
    categoryId,
    subcategoryId,
    imageUrl,
  ) => {
    updateSubcategory(categoryId, subcategoryId, { image: imageUrl });
  };

  const handleAddNewCategory = () => {
    if (!categoryForm.name.trim()) {
      alert("Please enter a category name");
      return;
    }

    const categoryId = categoryForm.name.toLowerCase().replace(/\s+/g, "-");
    const newCat = {
      id: categoryId,
      name: categoryForm.name,
      nameAr: categoryForm.nameAr || categoryForm.name,
      nameFr: categoryForm.nameFr || categoryForm.name,
      icon: categoryForm.icon,
      subcategories: [],
    };

    if (addCategory(newCat)) {
      setCategoryForm({ name: "", nameAr: "", nameFr: "", icon: "✨" });
      setShowAddCategory(false);
      alert("Category added successfully!");
    }
  };

  const handleAddNewSubcategory = (categoryId) => {
    if (!subcategoryForm.name.trim()) {
      alert("Please enter a subcategory name");
      return;
    }

    const subcategoryId = subcategoryForm.name
      .toLowerCase()
      .replace(/\s+/g, "-");
    const newSub = {
      id: subcategoryId,
      name: subcategoryForm.name,
      nameAr: subcategoryForm.nameAr || subcategoryForm.name,
      nameFr: subcategoryForm.nameFr || subcategoryForm.name,
      image:
        subcategoryForm.image ||
        "https://images.unsplash.com/photo-1556228578-dd26e4254f4a?w=400",
    };

    if (addSubcategory(categoryId, newSub)) {
      setSubcategoryForm({ name: "", nameAr: "", nameFr: "", image: "" });
      setShowAddSubcategory(null);
      alert("Subcategory added successfully!");
    }
  };

  const handleDeleteCategory = (categoryId) => {
    const hasProducts = products.some((p) => p.category === categoryId);
    if (hasProducts) {
      alert(
        "Cannot delete category - it has products. Delete the products first.",
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
        "Cannot delete subcategory - it has products. Delete the products first.",
      );
      return;
    }
    if (confirm("Are you sure you want to delete this subcategory?")) {
      if (deleteSubcategory(categoryId, subcategoryId)) {
        alert("Subcategory deleted successfully!");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Manage Categories & Subcategories
        </h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          ← Back to Products
        </button>
      </div>

      {/* Add Category Button */}
      <div>
        <button
          onClick={() => setShowAddCategory(!showAddCategory)}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          + Add New Category
        </button>
      </div>

      {/* Add Category Form */}
      {showAddCategory && (
        <div className="bg-white border-2 border-green-500 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Name (English) *
              </label>
              <input
                type="text"
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., Fragrances"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Name (Arabic)
              </label>
              <input
                type="text"
                value={categoryForm.nameAr}
                onChange={(e) =>
                  setCategoryForm((prev) => ({
                    ...prev,
                    nameAr: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., عطور"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Name (French)
              </label>
              <input
                type="text"
                value={categoryForm.nameFr}
                onChange={(e) =>
                  setCategoryForm((prev) => ({
                    ...prev,
                    nameFr: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., Parfums"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Icon (Emoji)
              </label>
              <input
                type="text"
                value={categoryForm.icon}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, icon: e.target.value }))
                }
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="e.g., 🌸"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddNewCategory}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Category
            </button>
            <button
              onClick={() => {
                setShowAddCategory(false);
                setCategoryForm({
                  name: "",
                  nameAr: "",
                  nameFr: "",
                  icon: "✨",
                });
              }}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white border rounded-lg p-6 shadow"
          >
            {/* Category Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={category.icon}
                  onChange={(e) =>
                    handleUpdateCategoryImage(
                      category.id,
                      "icon",
                      e.target.value,
                    )
                  }
                  className="text-2xl w-16 text-center border rounded px-2 py-1"
                  title="Click to edit icon"
                />
                <div>
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <p className="text-sm text-gray-500">ID: {category.id}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete Category
              </button>
            </div>

            {/* Subcategories Header */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-700">
                  Subcategories ({category.subcategories?.length || 0})
                </h4>
                <button
                  onClick={() =>
                    setShowAddSubcategory(
                      showAddSubcategory === category.id ? null : category.id,
                    )
                  }
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  + Add Subcategory
                </button>
              </div>

              {/* Add Subcategory Form */}
              {showAddSubcategory === category.id && (
                <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4 mb-4">
                  <h5 className="font-semibold mb-3">
                    Add Subcategory to {category.name}
                  </h5>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Name (English) *
                      </label>
                      <input
                        type="text"
                        value={subcategoryForm.name}
                        onChange={(e) =>
                          setSubcategoryForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="e.g., Perfume"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Name (Arabic)
                      </label>
                      <input
                        type="text"
                        value={subcategoryForm.nameAr}
                        onChange={(e) =>
                          setSubcategoryForm((prev) => ({
                            ...prev,
                            nameAr: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="e.g., عطر"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Name (French)
                      </label>
                      <input
                        type="text"
                        value={subcategoryForm.nameFr}
                        onChange={(e) =>
                          setSubcategoryForm((prev) => ({
                            ...prev,
                            nameFr: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="e.g., Parfum"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm font-medium mb-1">
                      Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "subcategory")}
                      className="w-full px-3 py-2 border rounded-lg mb-2"
                    />
                    <p className="text-xs text-gray-500 mb-1">
                      Or enter image URL:
                    </p>
                    <input
                      type="url"
                      value={subcategoryForm.image}
                      onChange={(e) =>
                        setSubcategoryForm((prev) => ({
                          ...prev,
                          image: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="https://example.com/image.jpg"
                    />
                    {subcategoryForm.image && (
                      <img
                        src={subcategoryForm.image}
                        alt="Preview"
                        className="mt-2 h-24 object-cover rounded"
                      />
                    )}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleAddNewSubcategory(category.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Subcategory
                    </button>
                    <button
                      onClick={() => {
                        setShowAddSubcategory(null);
                        setSubcategoryForm({
                          name: "",
                          nameAr: "",
                          nameFr: "",
                          image: "",
                        });
                      }}
                      className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Subcategories Grid */}
              {category.subcategories && category.subcategories.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.subcategories.map((sub) => (
                    <div
                      key={sub.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={sub.image}
                          alt={sub.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h5 className="font-medium">{sub.name}</h5>
                        <p className="text-xs text-gray-500 mb-2">
                          ID: {sub.id}
                        </p>

                        <div className="space-y-2">
                          <input
                            type="url"
                            value={sub.image}
                            onChange={(e) =>
                              handleUpdateSubcategoryImage(
                                category.id,
                                sub.id,
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border rounded text-xs"
                            placeholder="Image URL"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(
                                e,
                                "subcategory",
                                category.id,
                                sub.id,
                              )
                            }
                            className="w-full text-xs"
                            disabled={uploading}
                          />
                          {uploading && (
                            <p className="text-xs text-blue-600">
                              Uploading...
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() =>
                            handleDeleteSubcategory(category.id, sub.id)
                          }
                          className="mt-2 w-full px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click on category icons to edit them</li>
          <li>• Upload images or paste URLs for subcategories</li>
          <li>• Cannot delete categories/subcategories that have products</li>
          <li>• Changes are saved automatically to localStorage</li>
        </ul>
      </div>
    </div>
  );
}
