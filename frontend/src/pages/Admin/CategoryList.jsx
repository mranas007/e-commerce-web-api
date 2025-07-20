import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../components/Admin/AdminHeader';
import DeleteConfirmationModal from '../../components/Admin/DeleteConfirmationModal';
import axiosInstance from '../../utils/axiosConfig';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

import { useAuth } from '../../contexts/AuthContext';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(category =>
      category.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/Category/all');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    n  } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await axiosInstance.delete(`/Category/delete/${categoryId}`);
      setCategories(categories.filter(category => category.id !== categoryId));
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          title="Category Management"
          subtitle="Manage your product categories"
          showAddButton={true}
          onAddClick={() => navigate('/admin/categories/add')}
          addText="Add Category"
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Search */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCategories.map((category) => (
                    <tr key={category.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          title="Edit Category"
                        >
                          <FaEdit className="inline-block mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(category)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Category"
                        >
                          <FaTrash className="inline-block mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredCategories.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No categories found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the category "${categoryToDelete?.name}"? This action cannot be undone.`}
        onConfirm={() => handleDelete(categoryToDelete.id)}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default CategoryList;