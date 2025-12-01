import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatPrice, getImageUrl } from '../utils/formatters';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation to product detail

    if (!isAuthenticated()) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(product.id, 1);
    } catch (error) {
      // Error already handled in context
    }
  };

  // Render star rating
  const renderStars = () => {
    const rating = product.averageRating || 0;
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i - 0.5 <= rating) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    
    return stars;
  };

  return (
    <Link to={`/products/${product.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Product Image */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Stock Badge */}
          {product.stockQuantity === 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              Out of Stock
            </div>
          )}
          
          {product.stockQuantity > 0 && product.stockQuantity < 10 && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              Only {product.stockQuantity} left
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-1 mb-2">
            {product.categories?.slice(0, 2).map((category) => (
              <span
                key={category.id}
                className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full"
              >
                {category.name}
              </span>
            ))}
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600">
            {product.name}
          </h3>

          {/* Rating & Reviews */}
          <div className="flex items-center mb-2">
            <div className="flex">{renderStars()}</div>
            <span className="text-sm text-gray-500 ml-2">
              ({product.reviewCount || 0})
            </span>
          </div>

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>

            <button
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                product.stockQuantity === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;