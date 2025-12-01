import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import CartItem from '../components/CartItem';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatPrice } from '../utils/formatters';

const Cart = () => {
  const { cart, loading, fetchCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated]);

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Add some products to your cart and they will appear here.
          </p>
          <Link
            to="/products"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 font-semibold"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({cart.totalItems})</span>
                  <span>{formatPrice(cart.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(cart.totalAmount)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-semibold text-lg transition-colors"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center text-primary-600 hover:text-primary-700 mt-4 font-semibold"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-xl mr-2">✓</span>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-xl mr-2">✓</span>
                  <span>Free shipping on all orders</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="text-xl mr-2">✓</span>
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;