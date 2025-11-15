import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { path: '/', label: 'Ana Sayfa' },
    { path: '/anatomy', label: 'Egzersizler' },
    { path: '/blog', label: 'Blog' },
    { path: '/about', label: 'Hakkımızda' },
    { path: '/pricing', label: 'Fiyatlandırma' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
            <img 
              src="https://customer-assets.emergentagent.com/job_1d4b7ef8-6e29-408d-bb4a-e182899bb9e0/artifacts/yl97fd2i_logo.png" 
              alt="BYK LAB" 
              className="h-10 w-10"
            />
            <span className="text-xl font-bold text-white">BYK LAB</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-[#0f6e32]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  data-testid="dashboard-link"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <User size={18} />
                  <span className="text-sm">{user.full_name}</span>
                </Link>
                <button
                  onClick={logout}
                  data-testid="logout-button"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                >
                  <LogOut size={18} />
                  <span className="text-sm">Çıkış</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  data-testid="login-link"
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/signup"
                  data-testid="signup-link"
                  className="btn-primary text-sm"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
            data-testid="mobile-menu-button"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass border-t border-gray-800"
          data-testid="mobile-menu"
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-sm ${
                  isActive(link.path)
                    ? 'text-[#0f6e32]'
                    : 'text-gray-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-sm text-gray-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block py-2 text-sm text-gray-300 w-full text-left"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-sm text-gray-300"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-sm text-[#0f6e32]"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};