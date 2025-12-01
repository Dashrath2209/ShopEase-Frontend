import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from './pages/Profile';
import Register from "./pages/Register";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";

// Customer Pages
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import OrderDetailAdmin from "./pages/admin/OrderDetailAdmin";
import CategoryManagement from "./pages/admin/CategoryManagement";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:slug" element={<ProductDetail />} />

                {/* Customer Protected Routes */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/orders/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderDetail />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <ProductManagement />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <OrderManagement />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/orders/:orderId"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <OrderDetailAdmin />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/categories"
                  element={
                    <ProtectedRoute adminOnly={true}>
                      <CategoryManagement />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer />
          </div>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#4ade80",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

// 404 Not Found Component
const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>

        <a
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default App;
