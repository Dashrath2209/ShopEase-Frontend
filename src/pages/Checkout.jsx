import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import orderService from '../services/orderService';
import { formatPrice, getImageUrl } from '../utils/formatters';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cart, loading: cartLoading, fetchCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: user?.address || '',
    paymentMethod: 'COD',
  });

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (!cartLoading && (!cart || cart.items?.length === 0)) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [cart, cartLoading, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.shippingAddress.trim()) {
      toast.error('Please enter shipping address');
      return;
    }

    setLoading(true);

    try {
      const order = await orderService.placeOrder(formData);
      
      console.log('Order placed successfully:', order);
      
      // ✅ Clear cart after successful order
      if (clearCart) {
        try {
          await clearCart();
        } catch (err) {
          console.log('Cart already cleared on backend');
        }
      }
      
      toast.success('Order placed successfully!');
      
      // ✅ Navigate to order details
      setTimeout(() => {
        navigate(`/orders/${order.id}`);
      }, 500);
      
    } catch (error) {
      console.error('Order placement error:', error);
      
      // ✅ Better error handling
      let message = 'Failed to place order';
      
      if (error.response) {
        message = error.response.data?.message || error.response.statusText || message;
      } else if (error.request) {
        message = 'No response from server. Please check your connection.';
      } else {
        message = error.message || message;
      }
      
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!cart || cart.items?.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Shipping Address
                </h2>
                <textarea
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Enter your complete shipping address..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                ></textarea>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">Pay when you receive</p>
                    </div>
                    <span className="text-2xl">💵</span>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CARD"
                      checked={formData.paymentMethod === 'CARD'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Credit/Debit Card</p>
                      <p className="text-sm text-gray-600">Visa, Mastercard, etc.</p>
                    </div>
                    <span className="text-2xl">💳</span>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={formData.paymentMethod === 'UPI'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">UPI</p>
                      <p className="text-sm text-gray-600">Google Pay, PhonePe, etc.</p>
                    </div>
                    <span className="text-2xl">📱</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart?.items?.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={getImageUrl(item.product.imageUrl)}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × {formatPrice(item.product.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart?.totalAmount || 0)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>{formatPrice(cart?.totalAmount || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Placing Order...
                    </span>
                  ) : (
                    'Place Order'
                  )}
                </button>

                {/* Security Badge */}
                <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
                  <span className="text-xl mr-2">🔒</span>
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;