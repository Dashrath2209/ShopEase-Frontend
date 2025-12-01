import { createContext, useState, useEffect } from 'react';
import cartService from '../services/cartService';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch cart when component mounts or user logs in
  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      await cartService.addToCart(productId, quantity);
      await fetchCart(); // Refresh cart
      toast.success('Added to cart!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      toast.error(message);
      throw error;
    }
  };

  // Update cart item quantity
  const updateCartItem = async (productId, quantity) => {
    try {
      await cartService.updateCartItem(productId, quantity);
      await fetchCart(); // Refresh cart
      toast.success('Cart updated!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update cart';
      toast.error(message);
      throw error;
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      await cartService.removeFromCart(productId);
      await fetchCart(); // Refresh cart
      toast.success('Item removed from cart');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item';
      toast.error(message);
      throw error;
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      await cartService.clearCart();
      await fetchCart(); // Refresh cart
      toast.success('Cart cleared');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      toast.error(message);
      throw error;
    }
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cart?.totalItems || 0;
  };

  // Get cart total
  const getCartTotal = () => {
    return cart?.totalAmount || 0;
  };

  const value = {
    cart,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartItemCount,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};