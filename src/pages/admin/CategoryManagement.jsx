import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import productService from '../../services/productService';
import toast from 'react-hot-toast';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        // Update category
        await productService.updateCategory(editingCategory.id, formData);
        toast.success('Category updated successfully');
      } else {
        // Create category
        await productService.createCategory(formData);
        toast.success('Category created successfully');
      }
      handleCloseModal();
      fetchCategories();
    } catch (error) {
      const message = error.response?.data?.message || 'Operation failed';
      toast.error(message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? This will affect all products in this category.')) {
      return;
    }

    try {
      await productService.deleteCategory(id);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete category';
      toast.error(message);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
            <p className="text-gray-600 mt-1">Organize your products into categories</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 font-semibold"
          >
            + Add Category
          </button>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No categories yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first category to organize your products
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 font-semibold"
            >
              Create Category
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">🏷️</div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenModal(category)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h3>

                {category.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">{category.productCount || 0}</span> products
                  </div>
                  <div className="text-xs text-gray-500">
                    {category.slug}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Electronics, Clothing"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Brief description of the category"
                  ></textarea>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 font-semibold"
                  >
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;