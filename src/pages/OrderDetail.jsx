import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import orderService from '../services/orderService';
import { formatPrice, formatDateTime, getOrderStatusColor, getImageUrl } from '../utils/formatters';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Order not found');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setCancelling(true);
      await orderService.cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      await fetchOrderDetail(); // Refresh order data
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel order';
      toast.error(message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!order) {
    return null;
  }

  const canCancel = order.status === 'PENDING';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/orders"
            className="text-primary-600 hover:text-primary-700 font-semibold mb-4 inline-block"
          >
            ← Back to Orders
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600 mt-1">
                Placed on {formatDateTime(order.orderDate)}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getOrderStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
          <div className="flex items-center justify-between">
            {['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'].map((status, index) => {
              const statusIndex = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'].indexOf(order.status);
              const isCompleted = index <= statusIndex;
              const isCurrent = order.status === status;
              
              return (
                <div key={status} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <p className={`text-xs mt-2 text-center font-medium ${
                      isCurrent ? 'text-primary-600' : 'text-gray-600'
                    }`}>
                      {status}
                    </p>
                  </div>
                  {index < 3 && (
                    <div className={`flex-1 h-1 ${
                      index < statusIndex
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-b-0">
                <img
                  src={getImageUrl(item.product.imageUrl)}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <Link
                    to={`/products/${item.product.slug}`}
                    className="font-semibold text-gray-900 hover:text-primary-600"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">
                    Quantity: {item.quantity} × {formatPrice(item.priceAtPurchase)}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatPrice(item.subtotal)}
                </p>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div className="border-t border-gray-200 mt-4 pt-4">
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Shipping Address
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {order.shippingAddress}
            </p>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Payment Information
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold text-gray-900">
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span className="font-semibold text-green-600">
                  {order.paymentMethod === 'COD' ? 'Pay on Delivery' : 'Paid'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Order Button */}
        {canCancel && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Cancel Order</h3>
                <p className="text-sm text-gray-600 mt-1">
                  You can cancel this order as it hasn't been shipped yet.
                </p>
              </div>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          </div>
        )}

        {/* Cancelled Status */}
        {order.status === 'CANCELLED' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-800 font-semibold">
              This order has been cancelled
            </p>
          </div>
        )}

        {/* Delivered Status */}
        {order.status === 'DELIVERED' && order.deliveredDate && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-800 font-semibold">
              Delivered on {formatDateTime(order.deliveredDate)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;