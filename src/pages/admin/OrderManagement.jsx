import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination';
import orderService from '../../services/orderService';
import { formatPrice, formatDateTime, getOrderStatusColor } from '../../utils/formatters';
import toast from 'react-hot-toast';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchOrders(0);
  }, [filterStatus]);

  const fetchOrders = async (page) => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders(page, 15);
      
      // Filter by status if selected
      let filteredOrders = data.content || [];
      if (filterStatus) {
        filteredOrders = filteredOrders.filter(order => order.status === filterStatus);
      }
      
      setOrders(filteredOrders);
      setPageInfo({
        currentPage: data.number || 0,
        totalPages: data.totalPages || 0,
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }

    if (newStatus === selectedOrder.status) {
      toast.error('Please select a different status');
      return;
    }

    try {
      await orderService.updateOrderStatus(selectedOrder.id, newStatus);
      toast.success('Order status updated successfully');
      handleCloseStatusModal();
      fetchOrders(pageInfo.currentPage);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update order status';
      toast.error(message);
    }
  };

  const handlePageChange = (page) => {
    fetchOrders(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading && orders.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">View and manage all customer orders</p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                Filter by Status:
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Orders</option>
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            {filterStatus && (
              <button
                onClick={() => setFilterStatus('')}
                className="text-sm text-primary-600 hover:text-primary-700 font-semibold"
              >
                Clear Filter
              </button>
            )}

            <div className="ml-auto text-sm text-gray-600">
              Total: <span className="font-semibold">{orders.length}</span> orders
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600">
              {filterStatus 
                ? `No orders with status: ${filterStatus}` 
                : 'Orders will appear here once customers place them'}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.user.fullName || order.user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDateTime(order.orderDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {order.items?.length || 0} items
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatPrice(order.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <span className="mr-1">
                              {order.paymentMethod === 'COD' && '💵'}
                              {order.paymentMethod === 'CARD' && '💳'}
                              {order.paymentMethod === 'UPI' && '📱'}
                            </span>
                            {order.paymentMethod}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="text-primary-600 hover:text-primary-700"
                            >
                              View
                            </Link>
                            {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                              <>
                                <span className="text-gray-300">|</span>
                                <button
                                  onClick={() => handleOpenStatusModal(order)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  Update
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

        {/* Status Update Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Update Order Status
              </h2>

              <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  Order: <span className="font-semibold text-gray-900">{selectedOrder?.orderNumber}</span>
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Customer: <span className="font-semibold text-gray-900">{selectedOrder?.user.fullName || selectedOrder?.user.username}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Current Status: 
                  <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(selectedOrder?.status)}`}>
                    {selectedOrder?.status}
                  </span>
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="PENDING">PENDING - Order received</option>
                  <option value="CONFIRMED">CONFIRMED - Order confirmed</option>
                  <option value="SHIPPED">SHIPPED - Order shipped</option>
                  <option value="DELIVERED">DELIVERED - Order delivered</option>
                  <option value="CANCELLED">CANCELLED - Order cancelled</option>
                </select>
                
                <p className="mt-2 text-xs text-gray-500">
                  💡 Note: Changing status to DELIVERED will set the delivery date automatically.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleUpdateStatus}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 font-semibold transition-colors"
                >
                  Update Status
                </button>
                <button
                  onClick={handleCloseStatusModal}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;