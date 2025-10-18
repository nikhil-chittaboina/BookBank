import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// --- Import your page components ---
import Header from './components/Header'; // You'll need to update this to use the router links
import LoginPage from './pages/Login'; // Assume you create a simple login page
import HomePage from './pages/Home';   // Assume you create a simple Home page
import CatalogPage from './pages/Catalog';
import ProfilePage from './pages/Profile';
import AdminDashboardPage from './pages/AdminDashboard';
// ------------------------------------

const App = () => {
  return (
    <Router>
      <AuthProvider>
        {/* Header will be visible on all pages */}
        <Header /> 
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Authenticated Routes (Any logged-in user) */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'user']} />}>
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Admin-Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            {/* Add more admin routes here */}
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<div className="p-10 text-center">404 - Page Not Found</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;