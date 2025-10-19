import React from 'react';
import { Home, LayoutList, User, LogOut, Shield, BookOpen } from 'lucide-react'; // Added BookOpen icon
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavItem = ({ Icon, label, to, isActive }) => (
  <Link to={to} className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition duration-150 ${
    isActive 
      ? 'bg-gray-100 text-indigo-700 font-semibold shadow-inner' 
      : 'text-gray-600 hover:bg-gray-50'
  }`}>
    <Icon className="w-5 h-5" />
    <span className="text-sm">{label}</span>
  </Link>
);

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const getActivePage = (path) => {
    if (path.includes('/admin')) return 'Admin Panel';
    if (path === '/catalog') return 'Catalog';
    if (path === '/profile') return 'Profile';
    return 'Home';
  };
  
  const activePage = getActivePage(location.pathname);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm p-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* --- Logo and Brand (FIXED) --- */}
        <div className="flex items-center space-x-3">
            
          {/* Logo Icon */}
          <BookOpen className="w-7 h-7 text-indigo-600" />
            
          {/* Brand Text */}
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-gray-800">Book Bank</h1>
            <p className="text-xs text-indigo-600 italic">Invest your time, withdraw knowledge</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-4">
          <NavItem Icon={Home} label="Home" to="/" isActive={activePage === 'Home'} />
          
          {isAuthenticated ? (
            // --- AUTHENTICATED LINKS ---
            <>
              <NavItem Icon={LayoutList} label="Catalog" to="/catalog" isActive={activePage === 'Catalog'} />
              <NavItem Icon={User} label="Profile" to="/profile" isActive={activePage === 'Profile'} />
              
              {user && user.role === 'admin' && (
                <NavItem Icon={Shield} label="Admin Panel" to="/admin/dashboard" isActive={activePage === 'Admin Panel'} />
              )}
              
              <button onClick={logout} className="p-2 text-gray-600 hover:text-red-600 transition duration-150 flex items-center space-x-1">
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Logout</span>
              </button>
            </>
          ) : (
            // --- PUBLIC LINK ---
            <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 p-2">
                Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;