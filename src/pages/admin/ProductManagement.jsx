import { useState, useEffect } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination';
import productService from '../../services/productService';
import { formatPrice, getImageUrl } from '../../utils/formatters';
import toast from 'react-hot-toast';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    totalPages: 0,
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    sku: '',
    categoryIds: [],
    isActive: true,
  });

  useEffect(() => {
    fetchProducts(0);
    fetchCategories();
  }, []);

  const fetchProducts = async (page) => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts(page, 10);
      setProducts(data.content || []);
      setPageInfo({
        currentPage: data.number || 0,
        totalPages: data.totalPages || 0,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await productService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        stockQuantity: product.stockQuantity,
        sku: product.sku,
        categoryIds: product.categories.map(cat => cat.id),
        isActive: product.isActive,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        sku: '',
        categoryIds: [],
        isActive: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData({
      ...formData,
      categoryIds: formData.categoryIds.includes(categoryId)
        ? formData.categoryIds.filter(id => id !== categoryId)
        : [...formData.categoryIds, categoryId],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.categoryIds.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData);
        toast.success('Product updated successfully');
      } else {
        await productService.createProduct(formData);
        toast.success('Product created successfully');
      }
      handleCloseModal();
      fetchProducts(pageInfo.currentPage);
    } catch (error) {
      const message = error.response?.data?.message || 'Operation failed';
      toast.error(message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully');
      fetchProducts(pageInfo.currentPage);
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handlePageChange = (page) => {
    fetchProducts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && products.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <button
            onClick={() => handleOpenModal()}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 font-semibold"
          >
            + Add Product
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={getImageUrl(product.imageUrl)}
                          alt={product.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stockQuantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pageInfo.totalPages > 1 && (
          <Pagination
            currentPage={pageInfo.currentPage}
            totalPages={pageInfo.totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    ></textarea>
                  </div>

                  {/* Price & Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        name="stockQuantity"
                        value={formData.stockQuantity}
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU *
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      required
                      disabled={editingProduct !== null}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                    />
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories * (Select at least one)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((category) => (
                        <label
                          key={category.id}
                          className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={formData.categoryIds.includes(category.id)}
                            onChange={() => handleCategoryToggle(category.id)}
                            className="mr-2"
                          />
                          <span className="text-sm">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Active Status */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Active (visible to customers)
                      </span>
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 font-semibold"
                    >
                      {editingProduct ? 'Update Product' : 'Create Product'}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;