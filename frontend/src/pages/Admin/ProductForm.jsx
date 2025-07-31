// ProductForm.jsx - Improved Version
import AdminNavbar from "../../components/Admin/AdminNavbar";
import React, { useState, useEffect } from "react";
import { FaSave, FaUpload, FaSpinner } from "react-icons/fa";
import AdminHeader from "../../components/Admin/AdminHeader";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";
import { useAuth } from "../../contexts/AuthContext";

const useMultipleImageUpload = () => {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageUpload = (files) => {
    const newImages = Array.from(files);
    setImages((prev) => [...prev, ...newImages]);

    const newImagePreviews = [];
    let loadedCount = 0;

    newImages.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImagePreviews.push(reader.result);
        loadedCount++;
        if (loadedCount === newImages.length) {
          setImagePreviews((prev) => [...prev, ...newImagePreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    setImages([]);
    setImagePreviews([]);
  };

  return {
    images,
    imagePreviews,
    handleImageUpload,
    removeImage,
    clearImages,
    setImagePreviews,
  };
};

const useProductForm = (id) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: ""
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim()) newErrors.description = "Product description is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required";
    if (!formData.quantity || formData.quantity < 0) newErrors.quantity = "Valid quantity is required";
    if (!formData.categoryId || formData.categoryId.length !== 36) newErrors.categoryId = "Valid category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    validateForm,
    handleInputChange,
  };
};

const useProductAPI = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);



  const saveProduct = async (productData, images, previews) => {
    try {
      setSaving(true);
      const productFormData = new FormData();

      // Append product data
      productFormData.append("Name", productData.name);
      productFormData.append("Description", productData.description);
      productFormData.append("Price", parseFloat(productData.price).toString());
      productFormData.append("Quantity", parseInt(productData.quantity).toString());
      productFormData.append("CategoryId", productData.categoryId);

      // Append images
      images.forEach((image) => {
        productFormData.append("Images", image);
      });

      if (productData.id) {
        // For update, you might need to send the ID in the URL or as part of the form data
        // Assuming ID is sent in the URL for PUT requests
        await axiosInstance.put(`/Product/update-product/${productData.id}`, productFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log("updating products", productFormData)
      } else {
        const res = await axiosInstance.post("/Product/add-product", productFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log("addin products", await res.data)
      }

      return true;
    } catch (error) {
      console.error("Error saving product:", error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const fetchProduct = async (id) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/Product/get-product/${id}`);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  return { loading, saving, saveProduct, fetchProduct };
};

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { formData, setFormData, errors, setErrors, validateForm, handleInputChange } = useProductForm(id);
  const { loading, saving, saveProduct, fetchProduct } = useProductAPI();
  const { images, imagePreviews, handleImageUpload, removeImage, setImagePreviews } = useMultipleImageUpload();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axiosInstance.get("/Category/all")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (id) {
      fetchProduct(id).then((product) => {
        setFormData({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          quantity: product.quantity || "",
          categoryId: product.category || ""
        });

        if (product.images?.length) {
          const initialImagePreviews = product.images.map((img) => img.url);
          setImagePreviews(initialImagePreviews);
        }
      });
    }
  }, [id]);

  const handleImageChange = (e) => handleImageUpload(e.target.files);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const productData = {
        ...formData,
        id: id || null,
      };
      await saveProduct(productData, images, imagePreviews);
      navigate("/admin/products");
    } catch {
      setErrors({ submit: "Failed to save product. Please try again." });
    }
  };

  if (!token) return <Navigate to="/login" replace />;
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminNavbar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader
            title={id ? "Edit Product" : "Add New Product"}
            subtitle={id ? "Update product information" : "Create a new product listing"}
            showCancelButton={true}
            onCancelClick={() => navigate("/admin/products")}
            showSaveButton={true}
            onSaveClick={handleSubmit}
            saveButtonLoading={saving}
          />

          {/* Main Content */}
          <div className="flex-1 overflow-auto">

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? "border-red-500" : "border-gray-300"
                          }`}
                        placeholder="Enter product name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.categoryId ? "border-red-500" : "border-gray-300"
                          }`}
                      >
                        <option value="">Select category</option>
                        {categories.map((cat, idx) => (
                          <option key={idx} value={cat.id}> {/* Use cat.id for value */}
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      {errors.categoryId && (
                        <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
                      )}
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.price ? "border-red-500" : "border-gray-300"
                            }`}
                          placeholder="0.00"
                        />
                      </div>
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                      )}
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        min="0"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.quantity ? "border-red-500" : "border-gray-300"
                          }`}
                        placeholder="0"
                      />
                      {errors.quantity && (
                        <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="Enter product description"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                  </div>

                  {/* Image Upload */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Image
                    </label>
                    <div className="flex items-center space-x-4 flex-col">
                      <div className="w-full">
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <FaUpload className="w-8 h-8 mb-4 text-gray-500" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              multiple
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="w-full flex flex-wrap gap-1 mt-2">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="w-32 h-32 border rounded-lg overflow-hidden relative">
                            <img
                              src={preview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-1 text-xs"
                            >
                              X
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Active Status */}
                  {/* <div className="mt-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">Product is active</span>
                    </label>
                  </div> */}
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{errors.submit}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/products")}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                    disabled={saving}
                  >
                    {saving ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FaSave className="mr-2" />
                    )}
                    {id ? "Update Product" : "Add Product"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProductForm;