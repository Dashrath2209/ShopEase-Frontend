import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import productService from '../services/productService';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
  });

  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(0);
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const data = await productService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async (page) => {
    try {
      setLoading(true);
      let data;

      // Apply filters
      if (filters.search) {
        data = await productService.searchProducts(filters.search, page, 12);
      } else if (filters.category) {
        data = await productService.getProductsByCategory(filters.category, page, 12);
      } else if (filters.minPrice && filters.maxPrice) {
        data = await productService.filterByPrice(filters.minPrice, filters.maxPrice, page, 12);
      } else {
        data = await productService.getAllProducts(page, 12);
      }

      setProducts(data.content || []);
      setPageInfo({
        currentPage: data.number || 0,
        totalPages: data.totalPages || 0,
        totalElements: data.totalElements || 0,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL params
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((k) => {
      if (newFilters[k]) params.set(k, newFilters[k]);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
    });
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    fetchProducts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Products
          </h1>
          <p className="text-gray-600">
            {pageInfo.totalElements} products found
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </button>
              </div>

              {/* Search Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="Min"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="Max"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="createdAt">Newest</option>
                  <option value="price">Price: Low to High</option>
                  <option value="price,desc">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <LoadingSpinner />
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearFilters}
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pageInfo.totalPages > 1 && (
                  <Pagination
                    currentPage={pageInfo.currentPage}
                    totalPages={pageInfo.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;