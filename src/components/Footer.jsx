import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">🛒 ShopEase</h3>
            <p className="text-gray-400">
              Your one-stop shop for all your needs. Quality products at great prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <a 
                  href="https://dashrath2209.github.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="https://dashrath2209.github.io/#contact" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <a 
                  href="https://dashrath2209.github.io/#contact" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a 
                  href="https://dashrath2209.github.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Returns
                </a>
              </li>
              <li>
                <a 
                  href="https://dashrath2209.github.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📧 support@shopease.com</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>📍 123 Commerce St, City</li>
              <li className="pt-2">
                <a 
                  href="https://github.com/dashrath2209" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; 2025 ShopEase. All rights reserved. | 
            <a 
              href="https://dashrath2209.github.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 ml-1 transition-colors"
            >
              Created by Dashrath Yadav
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;