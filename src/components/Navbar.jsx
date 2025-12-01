import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl">🛒</div>
              <span className="text-xl font-bold text-primary-600">
                ShopEase
              </span>
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 items-center justify-center px-8">
            <form onSubmit={handleSearch} className="w-full max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600"
                >
                  🔍
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/products"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Products
            </Link>

            {isAuthenticated() ? (
              <>
                {/* Cart Icon with Badge */}
                <Link
                  to="/cart"
                  className="relative text-gray-700 hover:text-primary-600 px-3 py-2"
                >
                  <span className="text-2xl">🛒</span>
                  {getCartItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartItemCount()}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    <span className="text-xl">👤</span>
                    <span>{user?.username}</span>
                    <span className="text-xs">▼</span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    {isAdmin() && (
                      <>
                        <div className="border-t border-gray-200"></div>
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-sm text-primary-600 hover:bg-gray-100 font-medium"
                        >
                          Admin Dashboard
                        </Link>
                      </>
                    )}
                    <div className="border-t border-gray-200"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              <span className="text-2xl">{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </form>

            <Link
              to="/products"
              className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>

            {isAuthenticated() ? (
              <>
                <Link
                  to="/cart"
                  className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🛒 Cart ({getCartItemCount()})
                </Link>
                <Link
                  to="/orders"
                  className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
                {isAdmin() && (
                  <Link
                    to="/admin/dashboard"
                    className="block text-primary-600 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-red-600 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-primary-600 text-white hover:bg-primary-700 px-3 py-2 rounded-md text-base font-medium text-center mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;