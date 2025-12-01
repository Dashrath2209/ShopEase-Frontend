import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import orderService from '../../services/orderService';
import { formatPrice, formatDateTime, getOrderStatusColor, getImageUrl } from '../../utils/formatters';
import toast from 'react-hot-toast';

const OrderDetailAdmin = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
      setNewStatus(data.status);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Order not found');
      navigate('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (newStatus === order.status) {
      toast.error('Please select a different status');
      return;
    }

    try {
      setUpdatingStatus(true);
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      await fetchOrderDetail();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update order status';
      toast.error(message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/admin/orders"
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

        {/* Update Status Card */}
        {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Update Order Status
            </h2>
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
              <button
                onClick={handleUpdateStatus}
                disabled={updatingStatus || newStatus === order.status}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatingStatus ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        )}

        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Customer Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold text-gray-900">
                {order.user.fullName || order.user.username}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-gray-900">{order.user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-semibold text-gray-900">
                {order.user.phone || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">User ID</p>
              <p className="font-semibold text-gray-900">#{order.user.id}</p>
            </div>
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
                    Product ID: #{item.product.id}
                  </p>
                  <p className="text-sm text-gray-600">
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
              <span>Total Amount</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {order.paymentMethod === 'COD' ? 'COD' : 'Paid'}
                </span>
              </div>
              {order.deliveredDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivered On</span>
                  <span className="font-semibold text-gray-900">
                    {formatDateTime(order.deliveredDate)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailAdmin;
