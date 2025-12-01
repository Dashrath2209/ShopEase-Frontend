import api from './api';

const orderService = {
  // Place order
  placeOrder: async (orderData) => {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  },

  // Get my orders
  getMyOrders: async (page = 0, size = 10) => {
    const response = await api.get(`/api/orders?page=${page}&size=${size}`);
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await api.put(`/api/orders/${id}/cancel`);
    return response.data;
  },

  // ADMIN: Get all orders
  getAllOrders: async (page = 0, size = 20) => {
    const response = await api.get(`/api/orders/admin/all?page=${page}&size=${size}`);
    return response.data;
  },

  // ADMIN: Update order status
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/api/orders/admin/${id}/status`, {
      status,
    });
    return response.data;
  },
};

export default orderService;