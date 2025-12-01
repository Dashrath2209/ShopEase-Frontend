import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import productService from '../services/productService';
import reviewService from '../services/reviewService';
import { formatPrice, getImageUrl, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');

  // Review form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  });

  // Edit review
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetchProductData();
  }, [slug]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const productData = await productService.getProductBySlug(slug);
      setProduct(productData);

      // Fetch reviews
      const reviewsData = await reviewService.getReviewsByProduct(productData.id, 0, 10);
      setReviews(reviewsData.content || []);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await addToCart(product.id, quantity);
      setQuantity(1);
    } catch (error) {
      // Error handled in context
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) {
      toast.error('Please login to write a review');
      navigate('/login');
      return;
    }

    try {
      if (editingReview) {
        // Update existing review
        await reviewService.updateReview(editingReview.id, reviewForm);
        toast.success('Review updated successfully');
      } else {
        // Add new review
        await reviewService.addReview(product.id, reviewForm);
        toast.success('Review added successfully');
      }
      
      setShowReviewForm(false);
      setEditingReview(null);
      setReviewForm({ rating: 5, comment: '' });
      await fetchProductData(); // Refresh reviews and product data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit review';
      toast.error(message);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewForm({
      rating: review.rating,
      comment: review.comment,
    });
    setShowReviewForm(true);
    setActiveTab('reviews');
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await reviewService.deleteReview(reviewId);
      toast.success('Review deleted successfully');
      await fetchProductData(); // Refresh reviews and product data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete review';
      toast.error(message);
    }
  };

  const handleCancelEdit = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    setReviewForm({ rating: 5, comment: '' });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? 'text-yellow-400 text-2xl' : 'text-gray-300 text-2xl'}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const isMyReview = (review) => {
    return user?.username === review.user.username;
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product Main Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div>
              <img
                src={getImageUrl(product.imageUrl)}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            {/* Product Info */}
            <div>
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.categories?.map((category) => (
                  <span
                    key={category.id}
                    className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
                  >
                    {category.name}
                  </span>
                ))}
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex">{renderStars(Math.round(product.averageRating || 0))}</div>
                <span className="ml-2 text-gray-600">
                  {product.averageRating?.toFixed(1) || 0} ({product.reviewCount || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="text-4xl font-bold text-primary-600 mb-6">
                {formatPrice(product.price)}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stockQuantity > 0 ? (
                  <div className="flex items-center text-green-600">
                    <span className="text-2xl mr-2">✓</span>
                    <span className="font-semibold">
                      In Stock ({product.stockQuantity} available)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <span className="text-2xl mr-2">✕</span>
                    <span className="font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              {product.stockQuantity > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                    >
                      −
                    </button>
                    <span className="text-xl font-semibold w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
                  product.stockQuantity === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              {/* Product Meta */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>SKU:</strong> {product.sku}</p>
                  <p><strong>Added:</strong> {formatDate(product.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-6 py-4 font-semibold ${
                  activeTab === 'description'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-4 font-semibold ${
                  activeTab === 'reviews'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Reviews ({product.reviewCount || 0})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  {isAuthenticated() && !showReviewForm && (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                    >
                      Write a Review
                    </button>
                  )}
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="mb-8 bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-4">
                      {editingReview ? 'Edit Your Review' : 'Write Your Review'}
                    </h4>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className="text-3xl focus:outline-none"
                          >
                            <span className={star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}>
                              ★
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comment
                      </label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        rows="4"
                        required
                        minLength="10"
                        maxLength="1000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Share your experience with this product... (10-1000 characters)"
                      ></textarea>
                      <p className="text-xs text-gray-500 mt-1">
                        {reviewForm.comment.length}/1000 characters
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                      >
                        {editingReview ? 'Update Review' : 'Submit Review'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Reviews List */}
                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No reviews yet. Be the first to review this product!
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {review.user.fullName || review.user.username}
                            </p>
                            <div className="flex items-center mt-1">
                              {renderStars(review.rating)}
                              <span className="ml-2 text-sm text-gray-500">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                          </div>
                          
                          {/* Edit/Delete Buttons (Only for own reviews) */}
                          {isAuthenticated() && isMyReview(review) && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditReview(review)}
                                className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteReview(review.id)}
                                className="text-sm text-red-600 hover:text-red-700 font-semibold"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700 mt-2">{review.comment}</p>
                        
                        {review.updatedAt !== review.createdAt && (
                          <p className="text-xs text-gray-500 mt-2">
                            (Edited on {formatDate(review.updatedAt)})
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;