import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import productService from '../services/productService';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      
      // Fetch featured products (first 8)
      const productsData = await productService.getAllProducts(0, 8);
      setFeaturedProducts(productsData.content || []);

      // Fetch categories
      const categoriesData = await productService.getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold mb-4">
              Welcome to ShopEase
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Your one-stop shop for quality products at great prices
            </p>
            <Link
              to="/products"
              className="inline-block bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow text-center"
            >
              <div className="text-4xl mb-2">📦</div>
              <h3 className="font-semibold text-gray-800">{category.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {category.productCount || 0} products
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Products
          </h2>
          <Link
            to="/products"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Free Shipping
              </h3>
              <p className="text-gray-600">
                Free delivery on orders over $50
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure Payment
              </h3>
              <p className="text-gray-600">
                100% secure payment processing
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="text-5xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Returns
              </h3>
              <p className="text-gray-600">
                30-day hassle-free returns
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to start shopping?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Browse our collection and find your perfect products today!
          </p>
          <Link
            to="/products"
            className="inline-block bg-primary-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Explore Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;