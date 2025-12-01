import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatPrice, getImageUrl } from '../utils/formatters';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const [updating, setUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1 || newQuantity > item.product.stockQuantity) return;

    setQuantity(newQuantity);
    setUpdating(true);
    
    try {
      await updateCartItem(item.product.id, newQuantity);
    } catch (error) {
      // Revert on error
      setQuantity(item.quantity);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    if (window.confirm('Remove this item from cart?')) {
      await removeFromCart(item.product.id);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
      {/* Product Image */}
      <Link to={`/products/${item.product.slug}`} className="flex-shrink-0">
        <img
          src={getImageUrl(item.product.imageUrl)}
          alt={item.product.name}
          className="w-24 h-24 object-cover rounded-md"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1">
        <Link
          to={`/products/${item.product.slug}`}
          className="text-lg font-semibold text-gray-800 hover:text-primary-600"
        >
          {item.product.name}
        </Link>
        
        <p className="text-gray-600 mt-1">
          {formatPrice(item.product.price)} each
        </p>

        {/* Stock Warning */}
        {item.quantity > item.product.stockQuantity && (
          <p className="text-red-500 text-sm mt-1">
            ⚠️ Only {item.product.stockQuantity} available in stock
          </p>
        )}
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1 || updating}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold"
        >
          −
        </button>

        <span className="text-lg font-semibold w-12 text-center">
          {quantity}
        </span>

        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={quantity >= item.product.stockQuantity || updating}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right">
        <p className="text-xl font-bold text-primary-600">
          {formatPrice(item.subtotal)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="text-red-500 hover:text-red-700 p-2"
        title="Remove from cart"
      >
        <span className="text-2xl">🗑️</span>
      </button>
    </div>
  );
};

export default CartItem;