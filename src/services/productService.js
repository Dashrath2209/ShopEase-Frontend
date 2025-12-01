import api from './api';

const productService = {
  // Get all products (with pagination)
  getAllProducts: async (page = 0, size = 12) => {
    const response = await api.get(`/api/products?page=${page}&size=${size}`);
    return response.data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },

  // Get product by slug
  getProductBySlug: async (slug) => {
    const response = await api.get(`/api/products/slug/${slug}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query, page = 0, size = 12) => {
    const response = await api.get(`/api/products/search?q=${query}&page=${page}&size=${size}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (categoryId, page = 0, size = 12) => {
    const response = await api.get(`/api/products/category/${categoryId}?page=${page}&size=${size}`);
    return response.data;
  },

  // Filter by price range
  filterByPrice: async (minPrice, maxPrice, page = 0, size = 12) => {
    const response = await api.get(
      `/api/products/filter?minPrice=${minPrice}&maxPrice=${maxPrice}&page=${page}&size=${size}`
    );
    return response.data;
  },

  // ADMIN: Create product
  createProduct: async (productData) => {
    const response = await api.post('/api/products', productData);
    return response.data;
  },

  // ADMIN: Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/api/products/${id}`, productData);
    return response.data;
  },

  // ADMIN: Delete product
  deleteProduct: async (id) => {
    await api.delete(`/api/products/${id}`);
  },

  // Get all categories
  getAllCategories: async () => {
    const response = await api.get('/api/categories');
    return response.data;
  },

// CATEGORY MANAGEMENT (Add to productService object)

// Create category
createCategory: async (categoryData) => {
  const response = await api.post('/api/categories', categoryData);
  return response.data;
},

// Update category
updateCategory: async (id, categoryData) => {
  const response = await api.put(`/api/categories/${id}`, categoryData);
  return response.data;
},

// Delete category
deleteCategory: async (id) => {
  await api.delete(`/api/categories/${id}`);
},

};

export default productService;