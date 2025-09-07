import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-green-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-white text-xl font-bold">FRA Atlas</span>
              <span className="ml-2 text-green-300 text-sm bg-green-900 rounded-full px-2 py-0.5">WebGIS</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:ml-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/map" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Map
                </Link>
                <Link to="/dss" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  DSS
                </Link>
                {user.role === 'admin' && (
                  <Link to="/ocr" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    AI Tools
                  </Link>
                )}
                <div className="ml-4 relative flex-shrink-0 flex items-center">
                  <div className="text-sm text-white mr-4">
                    Welcome, {user.name} ({user.role})
                  </div>
                  <button
                    onClick={onLogout}
                    className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-green-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="block text-gray-200 hover:text-white hover:bg-green-700 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/map"
                className="block text-gray-200 hover:text-white hover:bg-green-700 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Map
              </Link>
              <Link
                to="/dss"
                className="block text-gray-200 hover:text-white hover:bg-green-700 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                DSS
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/ocr"
                  className="block text-gray-200 hover:text-white hover:bg-green-700 px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  AI Tools
                </Link>
              )}
              <div className="pt-4 pb-3 border-t border-green-700">
                <div className="px-3 py-2 text-sm text-white">
                  Logged in as <span className="font-bold">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left block text-gray-200 hover:text-white hover:bg-green-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="block text-gray-200 hover:text-white hover:bg-green-700 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;