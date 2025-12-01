import api from './api';

const cartService = {
  // Get my cart
  getCart: async () => {
    const response = await api.get('/api/cart');
    return response.data;
  },

  // Add to cart
  addToCart: async (productId, quantity) => {
    const response = await api.post('/api/cart/items', {
      productId,
      quantity,
    });
    return response.data;
  },

  // Update cart item
  updateCartItem: async (productId, quantity) => {
    const response = await api.put(`/api/cart/items/${productId}`, {
      quantity,
    });
    return response.data;
  },

  // Remove from cart
  removeFromCart: async (productId) => {
    await api.delete(`/api/cart/items/${productId}`);
  },

  // Clear cart
  clearCart: async () => {
    await api.delete('/api/cart');
  },
};

export default cartService;