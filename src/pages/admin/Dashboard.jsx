import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import productService from '../../services/productService';
import orderService from '../../services/orderService';
import { formatPrice } from '../../utils/formatters';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch products count
      const productsData = await productService.getAllProducts(0, 1);
      
      // Fetch orders
      const ordersData = await orderService.getAllOrders(0, 5);
      const allOrdersData = await orderService.getAllOrders(0, 1000);
      
      // Calculate stats
      const totalRevenue = allOrdersData.content
        ?.filter(order => order.status !== 'CANCELLED')
        .reduce((sum, order) => sum + order.totalAmount, 0) || 0;
      
      const pendingOrders = allOrdersData.content
        ?.filter(order => order.status === 'PENDING').length || 0;

      setStats({
        totalProducts: productsData.totalElements || 0,
        totalOrders: allOrdersData.totalElements || 0,
        totalRevenue: totalRevenue,
        pendingOrders: pendingOrders,
      });

      setRecentOrders(ordersData.content || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(stats.totalRevenue)}
                </p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>

          {/* Total Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="text-4xl">🛍️</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/products"
            className="bg-primary-600 text-white rounded-lg shadow-md p-6 hover:bg-primary-700 transition-colors"
          >
            <div className="text-3xl mb-2">📦</div>
            <h3 className="text-lg font-semibold mb-1">Manage Products</h3>
            <p className="text-sm text-primary-100">Add, edit, or remove products</p>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-green-600 text-white rounded-lg shadow-md p-6 hover:bg-green-700 transition-colors"
          >
            <div className="text-3xl mb-2">📋</div>
            <h3 className="text-lg font-semibold mb-1">Manage Orders</h3>
            <p className="text-sm text-green-100">View and update order status</p>
          </Link>

          <Link
            to="/admin/categories"
            className="bg-purple-600 text-white rounded-lg shadow-md p-6 hover:bg-purple-700 transition-colors"
          >
            <div className="text-3xl mb-2">🏷️</div>
            <h3 className="text-lg font-semibold mb-1">Manage Categories</h3>
            <p className="text-sm text-purple-100">Organize product categories</p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <Link
              to="/admin/orders"
              className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
            >
              View All →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders yet</p>
          ) : (
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
                      Total
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
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="text-primary-600 hover:text-primary-700 font-semibold"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
