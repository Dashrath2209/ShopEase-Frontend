import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import orderService from '../services/orderService';
import { formatPrice, formatDateTime, getOrderStatusColor } from '../utils/formatters';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchOrders(0);
  }, []);

  const fetchOrders = async (page) => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders(page, 10);
      setOrders(data.content || []);
      setPageInfo({
        currentPage: data.number || 0,
        totalPages: data.totalPages || 0,
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchOrders(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            No orders yet
          </h2>
          <p className="text-gray-600 mb-8">
            Start shopping and your orders will appear here.
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold text-gray-900">
                      {formatDateTime(order.orderDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="font-semibold text-gray-900">
                      {formatPrice(order.totalAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getOrderStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4">
                <div className="space-y-3">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-2xl">
                          📦
                        </div>
                        <div>
                          <Link
                            to={`/products/${item.product.slug}`}
                            className="font-medium text-gray-900 hover:text-primary-600"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × {formatPrice(item.priceAtPurchase)}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-sm text-gray-600 text-center">
                      + {order.items.length - 3} more items
                    </p>
                  )}
                </div>
              </div>

              {/* Order Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium text-gray-900">{order.paymentMethod}</p>
                </div>
                <Link
                  to={`/orders/${order.id}`}
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  View Details →
                </Link>
              </div>
            </div>
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
      </div>
    </div>
  );
};

export default Orders;